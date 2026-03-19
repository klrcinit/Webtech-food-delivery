import { Component, signal, OnInit } from '@angular/core';
import { CartService } from './customer/services/cart.service';
import { Router } from '@angular/router';
import { LoadingService } from './customer/services/loading.service';
import { ToastService } from './customer/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  loading$;
  toast$;

  protected readonly title = signal('webtech-food-delivery');

  cartItemCount: number = 0;
  userEmail: string = "";

  constructor(
    private cartService: CartService,
    private router: Router,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.loading$ = this.loadingService.loading$;
    this.toast$ = this.toastService.message$; }

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
    this.userEmail = localStorage.getItem("email") || "";
    return localStorage.getItem("token") !== null;

  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  protected readonly localStorage = localStorage;
}
