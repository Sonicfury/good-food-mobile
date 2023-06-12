import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
