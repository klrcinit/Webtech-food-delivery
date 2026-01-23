import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { Restaurants } from './pages/restaurants/restaurants';
import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';


@NgModule({
  declarations: [
    Restaurants,
    RestaurantDetail,
    Cart,
    Orders
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
