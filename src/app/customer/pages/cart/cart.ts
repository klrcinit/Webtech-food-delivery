import {Component, OnInit} from '@angular/core';
import { CartService } from '../../services/cart.service';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {

  // 3. Spremenljivke, ki jih HTML potrebuje
  items: any[] = [];
  total: number = 0;
  voucherCode: string = "";
  discount: number = 0;
  cartItemCount: number = 0;
  successMessage: string = "";

  // 4. Povežemo se s servisom
  constructor(private cartService: CartService, private toastService: ToastService) {}

  // 5. Ko se stran odpre, naložimo pice
  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.calculateTotal();
    this.cartItemCount = this.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  // Pomožna funkcija za seštevanje
  calculateTotal() {
    this.total = this.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
      0
  );
  }
    increase(item: any) {
      this.cartService.increaseQuantity(item);
      this.items = this.cartService.getItems();
      this.calculateTotal();
      this.cartItemCount = this.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }

    decrease(item: any) {
      this.cartService.decreaseQuantity(item);
      this.items = this.cartService.getItems();
      this.calculateTotal();
      this.cartItemCount = this.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }


  // Funkcija za gumb Izprazni
  clearCart() {
    this.cartService.clearCart();
    this.items = [];
    this.total = 0;
    this.discount = 0;
    this.voucherCode = "";
  }

  // Funkcija za gumb
  checkout() {
    if (this.items.length === 0) {
      return; // stop if cart empty
    }



    const orderData = {
      user_id: Number(localStorage.getItem("user_id")),
      items: this.items.map(item => ({
        dish_id: item.id,
        quantity: item.quantity }
      ))
        };
    this.cartService.checkout(orderData).subscribe({
      next: (data) => {
        console.log("Order response:", data);
        this.toastService.show("Order successfully placed!");
        this.clearCart();

        setTimeout(() => {
          window.location.href = "/customer/orders";
        }, 1500);
      },

      error: (error) => {
        console.error("Checkout error:", error);
        this.successMessage = "Error placing order.";
      }
    });
      }
  applyVoucher() {

    if (this.discount > 0) {
      this.toastService.show("Voucher already applied");
      return;
    }

    if (this.voucherCode === "SAVE10") {
      this.discount = this.total * 0.10;
      this.toastService.show("10% discount applied!");
    } else {
      this.toastService.show("Invalid voucher");
    }
  }

    get deliveryFee(): number {

      if (this.total >= 40) {
        return 0;
      }

      return 3.5;

    }
    get freeDeliveryReached(): boolean {
      return this.total >= 40;
    }

  get freeDeliveryProgress(): number {

    const progress = (this.total / 40) * 100;

    return Math.min(progress, 100);

  }

  }



