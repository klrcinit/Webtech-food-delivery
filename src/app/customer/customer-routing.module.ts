import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Restaurants } from './pages/restaurants/restaurants';
import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { Login } from './pages/login/login';
import { AuthGuard } from '../auth.guard';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/login/forgot-password/forgot-password';
import { Profile } from './pages/profile/profile';
const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  { path: 'restaurants', component: Restaurants, canActivate: [AuthGuard] },
  { path: 'restaurants/:id', component: RestaurantDetail, canActivate: [AuthGuard] },
  { path: 'cart', component: Cart, canActivate: [AuthGuard] },
  { path: 'orders', component: Orders, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {
}

