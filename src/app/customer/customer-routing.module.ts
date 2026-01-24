import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Restaurants } from './pages/restaurants/restaurants';
import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail';
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';

const routes: Routes = [
  { path: 'restaurants', component: Restaurants },
  { path: 'restaurants/:id', component: RestaurantDetail },
  { path: 'cart', component: Cart },
  { path: 'orders', component: Orders },
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}

