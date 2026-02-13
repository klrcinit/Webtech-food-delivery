import {Component, OnInit} from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {

  // 3. Spremenljivke, ki jih HTML potrebuje
  items: any[] = [];
  total: number = 0;

  // 4. Povežemo se s servisom
  constructor(private cartService: CartService) {}

  // 5. Ko se stran odpre, naložimo pice
  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.calculateTotal();
  }

  // Pomožna funkcija za seštevanje
  calculateTotal() {
    console.log("Cart items:", this.items);
    this.total = this.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
      0
  );
  }

  // Funkcija za gumb Izprazni
  clearCart() {
    this.items = this.cartService.clearCart();
    this.total = 0;
  }

  // Funkcija za gumb
  checkout() {
    const orderData = {
      user_id: 1, // temporary hardcoded user
      items: this.items.map(item => ({
        dish_id: item.id,
        quantity: item.quantity }
      ))
    }

    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Order response:", data);
        alert("Order successfully placed!");
        this.clearCart();
      })
      .catch(error => {
        console.error("Checkout error:", error);
        alert("Error placing order.");
      });
  }

}
