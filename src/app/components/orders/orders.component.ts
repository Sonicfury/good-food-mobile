import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrdersService, State } from 'src/app/services/orders.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  state$!: typeof this._ordersService.state$;
  deliveredOrders: Order[] = [];

  constructor(
    private _ordersService: OrdersService,
    private _snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this._ordersService.state$.subscribe((orders) => {
      this.orders = orders.TO_DELIVER;
      this.deliveredOrders = orders.DONE;
    });
  }

  markAs(state: State, order: Order) {
    this._ordersService
      .markAs(state, order)
      .subscribe((id) =>
        this._snackbar.info(`La commande ${id} a été mise à jour.`)
      );
  }
}
