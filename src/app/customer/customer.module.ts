import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { Restaurants } from './pages/restaurants/restaurants';
import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { Login } from './pages/login/login';
import { FormsModule } from '@angular/forms';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { ForgotPassword } from './pages/login/forgot-password/forgot-password';

@NgModule({
  declarations: [
    Restaurants,
    RestaurantDetail,
    Cart,
    Orders,
    Login,
    Register,
    Profile,
    ForgotPassword
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule
  ]
})
export class CustomerModule { }
