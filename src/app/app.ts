import { Component, signal, OnInit } from '@angular/core';
import { CartService } from './customer/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  protected readonly title = signal('webtech-food-delivery');

  cartItemCount: number = 0;
  userEmail: string = "";

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {

    this.userEmail = localStorage.getItem("email") || "";

    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });

  }

  logout() {

    localStorage.clear();
    this.userEmail = "";
    this.router.navigate(['/customer/login']);
  }

  isLoggedIn(): boolean {

    return localStorage.getItem("token") !== null;

  }

}
