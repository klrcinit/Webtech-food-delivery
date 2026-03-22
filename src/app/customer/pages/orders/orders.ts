import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import {CartService} from '../../services/cart.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})

export class Orders implements OnInit {

  orders: Order[] = [];
  loading = true;
  cartItemCount: number = 0;

  constructor(
    private restaurantService: RestaurantService, private cartService: CartService) {
  }


  ngOnInit(): void {
    const items = this.cartService.getItems();

    this.cartItemCount = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.restaurantService.getOrders().subscribe((data) => {
      this.orders = data;
      this.loading = false;
      console.log("Orders loaded:", data);
    });
  }

  getOrderStatus(order: any): string {

    const created = new Date(order.created_at).getTime();
    const now = Date.now();
    const estimated: number = Number(order.estimated_delivery_minutes);

    const minutesPassed = (now - created) / 60000;

    if (minutesPassed < 5) {
      return "Preparing";
    }

    if (minutesPassed < estimated) {
      return "On the way";
    }

    return "Delivered";

  }

  getRemainingMinutes(order: any): number {

    const created = new Date(order.created_at).getTime();
    const now = Date.now();
    const estimated = Number(order.estimated_delivery_minutes);

    const minutesPassed = (now - created) / 60000;

    const remaining = estimated - minutesPassed;

    return Math.max(0, Math.round(remaining));

  }

  isActive(order: any): boolean {
    return this.getRemainingMinutes(order) > 0;
  }

  isPrevious(order: any): boolean {
    return this.getRemainingMinutes(order) === 0;
  }

  hasActiveOrders(): boolean {
    return this.orders.some(o => this.isActive(o));
  }

  hasPreviousOrders(): boolean {
    return this.orders.some(o => this.isPrevious(o));
  }
}
