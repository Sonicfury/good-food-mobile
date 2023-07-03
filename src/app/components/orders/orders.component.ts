import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrderDetails } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
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
  // ordersDetails: Record<number, {isVisible: boolean, details: OrderDetails}> = {};
  ordersDetails: Record<number, { isVisible: boolean, details: any }> = {};

  constructor(
    private _ordersService: OrdersService,
    private _snackbar: SnackbarService,
    private _auth: AuthService,
    private _router: Router
  ) { }

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

  onDetailsToggle(orderId: number) {
    if (this.ordersDetails[orderId]) {
      this.ordersDetails[orderId].isVisible = !this.ordersDetails[orderId].isVisible;
      return;
    }

    this.ordersDetails[orderId] = {
      isVisible: true,
      details: {}
    };

    this._ordersService.getDetails(orderId).subscribe(data => {
      this.ordersDetails[orderId].details = { ...data };
    });
  }

  openMap(event: Event, orderId: number) {
    event.stopPropagation();

    const address = this.ordersDetails[orderId].details.address;
    const addressStr = Object.values(address).join(' ');

    const encodedAddress = encodeURIComponent(addressStr);
    const deeplinkURL = `maps://maps.apple.com/?q=${encodedAddress}`;
    window.open(deeplinkURL, '_system');
  }

  logout() {
   this._auth.logout();
   this._router.navigate(['/login']);
  }
}
