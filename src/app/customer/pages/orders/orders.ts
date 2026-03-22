import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import {CartService} from '../../services/cart.service';
import { Order } from '../../../models/order.model';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

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
  activeTab: 'active' | 'previous' = 'active';
  private timerSub!: Subscription;
  currentTime: number = Date.now();

  constructor(
    private restaurantService: RestaurantService,
    private cartService: CartService,
    private toastService: ToastService) {
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
      console.log("Orders loaded in component:", this.orders);
      console.log("Orders loaded:", data);
      (window as any).ordersComponent = this;
    });
    setInterval(() => {
      this.currentTime = Date.now();
    }, 30000);
  }

  getOrderStatus(order: any): string {

    const created = new Date(order.created_at).getTime();
    const now = this.currentTime;
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
    const now = this.currentTime;
    const estimated = Number(order.estimated_delivery_minutes);

    const minutesPassed = (now - created) / 60000;

    const remaining = estimated - minutesPassed;

    return Math.max(0, Math.round(remaining));

  }

  isActive(order: any): boolean {
    return this.getRemainingMinutes(order) > 0;
  }

  isPrevious(order: any): boolean {
    return this.getRemainingMinutes(order) <= 0;
  }

  hasActiveOrders(): boolean {
    return this.orders.some(o => this.isActive(o));
  }

  hasPreviousOrders(): boolean {
    return this.orders.some(o => this.isPrevious(o));
  }

  getProgress(order: any): number {
    const created = new Date(order.created_at).getTime();
    const now = this.currentTime;
    const estimated = Number(order.estimated_delivery_minutes);

    const minutesPassed = (now - created) / 60000;

    const progress = (minutesPassed / estimated) * 100;

    return Math.min(100, Math.max(5, progress));
  }

  reorder(order: any): void {
    if (!order.items) return;

    order.items.forEach((item: any) => {
      for (let i = 0; i < item.quantity; i++) {
        this.cartService.addToCart({
          id: item.id,
          name: item.name,
          price: item.price
        });
      }
    });

    this.toastService.show("🛒 Order added to cart", "success");
  }

  ngOnDestroy(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  getActiveOrders(): Order[] {
    return this.orders.filter(o => this.isActive(o));
  }

}
