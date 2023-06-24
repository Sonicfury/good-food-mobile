import { Injectable } from '@angular/core';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Order } from '../models/order';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

export type OrdersState = Record<
  keyof typeof OrdersService.ORDER_STATE,
  Order[]
>;
export type State = keyof typeof OrdersService.ORDER_STATE;

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public static readonly ORDER_STATE = {
    TO_DELIVER: '3',
    DONE: '4',
  };

  private _channel!: RealtimeChannel;
  private _state$!: BehaviorSubject<OrdersState>;

  constructor(
    private _supabaseService: SupabaseService,
    private _auth: AuthService
  ) {}

  markAs(state: State, order: Order): Observable<number> {
    return from(
      this._supabaseService.supabase
        .from('orders')
        .update({ state: OrdersService.ORDER_STATE[state] })
        .eq('id', order.id)
    ).pipe(switchMap((_) => of(order.id)));
  }

  private _getByEmployeeId(employeeId: string): Observable<Order[]> {
    return from(
      this._supabaseService.supabase
        .from('orders')
        .select()
        .eq('employee_id', Number(employeeId))
        .eq('isTakeaway', true)
        .order('updated_at', { ascending: false })
    ).pipe(map(({ data }) => data as Order[]));
  }

  private _handleEvent(
    payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
  ) {
    const current = this._state$.value;

    if (payload.eventType === 'DELETE') {
      const newState: OrdersState = {
        TO_DELIVER: current.TO_DELIVER.filter(
          (td) => td.id !== payload.old['id']
        ),
        DONE: current.DONE.filter((td) => td.id !== payload.old['id']),
      };
      this._state$.next(newState);

      return;
    }

    if (payload.eventType === 'INSERT') {
      const order = payload.new as Order;
      if (!order.isTakeaway) return;

      const newState = { ...current };
      const orderState = Object.entries(OrdersService.ORDER_STATE).find(
        ([k, v]) => v === order.state
      );
      if (!orderState) return;

      const key = orderState[0] as keyof typeof OrdersService.ORDER_STATE;
      newState[key] = [order, ...newState[key]];
      this._state$.next(newState);

      return;
    }

    if (payload.eventType === 'UPDATE') {
      const order = payload.new as Order;
      if (!order.isTakeaway) return;

      const newState: OrdersState = {
        TO_DELIVER: current.TO_DELIVER.filter(
          (td) => td.id !== payload.old['id']
        ),
        DONE: current.DONE.filter((td) => td.id !== payload.old['id']),
      };
      const orderState = Object.entries(OrdersService.ORDER_STATE).find(
        ([k, v]) => v === order.state
      );
      if (!orderState) return;

      const key = orderState[0] as keyof typeof OrdersService.ORDER_STATE;
      newState[key] = [order, ...newState[key]];
      this._state$.next(newState);

      return;
    }
  }

  get state$(): Observable<OrdersState> {
    const userId = this._auth.session?.user?.id;
    const filter = `employee_id=eq.${userId}`;
    this._channel = this._supabaseService.supabase
      .channel('orders_change')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter },
        (payload) => this._handleEvent(payload)
      );

    return this._getByEmployeeId(userId as string).pipe(
      tap((orders: Order[]) => {
        const toDeliver = orders?.filter(
          (o) => o.state === OrdersService.ORDER_STATE.TO_DELIVER
        );
        const delivered = orders?.filter(
          (o) => o.state === OrdersService.ORDER_STATE.DONE
        );

        this._state$ = new BehaviorSubject({
          TO_DELIVER: toDeliver,
          DONE: delivered,
        });

        this._channel.subscribe();
      }),
      switchMap((_) => this._state$)
    );
  }
}
