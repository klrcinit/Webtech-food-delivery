import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Tukaj bomo shranjevali izbrane jedi
  private items: any[] = JSON.parse(localStorage.getItem('cart') || '[]');

  cartCount$ = new BehaviorSubject<number>(this.getCartItemCount());

    constructor(private http: HttpClient, private toastService: ToastService) {
  }

  // 1. Dodaj v košarico
  addToCart(product: any) {
    const existing = this.items.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }
    this.updateCart();
    console.log('Added to cart:', product.name);
    this.toastService.show(`${product.name} added to cart 🛒`, 'default');
    }

  // 2. Dobi vse izdelke (za prikaz v košarici)
  getItems() {
    return this.items;
  }

  // 3. Izprazni košarico (po nakupu)
  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
    this.cartCount$.next(0);
    return this.items;
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.updateCart();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.items = this.items.filter(i => i.id !== item.id);
    }
    this.updateCart();
  }

  private updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.cartCount$.next(this.getCartItemCount());
  }

  getCartItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

    checkout(orderData: any) {
      return this.http.post('http://localhost:3000/api/orders', orderData);
    }
}
