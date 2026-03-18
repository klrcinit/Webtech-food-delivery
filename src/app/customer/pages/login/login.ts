import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  email = "";
  password = "";
  errorMessage = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  private cdr: ChangeDetectorRef

) {}

  ngOnInit() {

    if (localStorage.getItem("token")) {
      this.router.navigate(['/customer/restaurants']);
    }

  }

  login() {

    console.log("LOGIN CLICKED");

    this.errorMessage = "";

    this.authService.login(this.email, this.password)

    this.errorMessage = "";

    this.authService.login(this.email, this.password)
      .subscribe({

        next: (user: any) => {

          localStorage.setItem("token", user.token);
          localStorage.setItem("user_id", user.id);
          localStorage.setItem("email", user.email);
          localStorage.setItem("role", user.role);

          if (user.role === "owner") {
            this.router.navigate(['/owner/dashboard']);
          } else {
            this.router.navigate(['/customer/restaurants']);
          }
        },

        error: (err) => {

          console.log("LOGIN ERROR:", err);

          this.errorMessage = err?.error?.error || "Invalid email or password";

          this.cdr.detectChanges();

        }
      });
  }

  }

