import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public static readonly ORDER_STATE = {
    TO_DELIVER: "3",
    DONE: "4",
  }

  constructor(private _supabaseService: SupabaseService) { }

  getByEmployeeId(employeeId: string): Observable<Order[]>{
    return from(
      this._supabaseService.supabase.from('orders')
        .select()
        .eq('employee_id', Number(employeeId))
        .eq('isTakeaway', true)
        .order('updated_at', { ascending: false })
    ).pipe(
      map(({ data }) => data as Order[])
    )
  }
}
