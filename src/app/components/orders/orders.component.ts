import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  deliveredOrders: Order[] = [];

  constructor(
    private _auth: AuthService,
    private _ordersService: OrdersService,
    private _snackbar: SnackbarService
  ) {
  }

  ngOnInit(): void {
    this._ordersService.getByEmployeeId(this._auth.session?.user?.id as string)
    .pipe(
    ).subscribe(orders => {
      this.orders = orders?.filter(o => o.state === OrdersService.ORDER_STATE.TO_DELIVER);
      this.deliveredOrders = orders?.filter(o => o.state === OrdersService.ORDER_STATE.DONE);
    })
  }

  markAs(action: string, order: Order) {
    const ACTIONS = {
      DELIVERED: 'delivered',
      TO_DELIVER: 'to_deliver'
    }
    let message = '';

    if (action === ACTIONS.DELIVERED) {
        this.deliveredOrders = [order, ...this.deliveredOrders]
        this.orders = this.orders.filter(o => o.id !== order.id)
        this._snackbar.success(`La commande ${order.id} a été marquée comme livrée.`);
        return;
      }
    if (action === ACTIONS.TO_DELIVER) {
        this.orders = [order, ...this.orders]
        this.deliveredOrders = this.deliveredOrders.filter(o => o.id !== order.id)
        this._snackbar.warning(`La commande ${order.id} a été marquée comme à livrer.`);
        return;
      }
  }
}
