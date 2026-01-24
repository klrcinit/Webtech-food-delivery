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
    this.total = 0;
    for (let item of this.items) {
      this.total += Number(item.price);
    }
  }

  // Funkcija za gumb Izprazni
  clearCart() {
    this.items = this.cartService.clearCart();
    this.total = 0;
  }

  // Funkcija za gumb Naroči
  checkout() {
    alert('Successfully checkout! :)');
  }

}
