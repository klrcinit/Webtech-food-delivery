import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Tukaj bomo shranjevali izbrane jedi
  private items: any[] = JSON.parse(localStorage.getItem('cart') || '[]');

  constructor() {
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
  }

  // 2. Dobi vse izdelke (za prikaz v košarici)
  getItems() {
    return this.items;
  }

  // 3. Izprazni košarico (po nakupu)
  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
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
  }
}
