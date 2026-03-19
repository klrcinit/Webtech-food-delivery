import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})

export class ForgotPassword {

  email = "";
  newPassword = "";
  message = "";

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {

    this.http.put("http://localhost:3000/api/reset-password", {
      email: this.email,
      password: this.newPassword
    }).subscribe({
      next: () => {
        this.message = "Password successfully reset";

        setTimeout(() => {
          this.router.navigate(['/customer/login']);
        }, 1500);
      },
      error: () => {
        this.message = "Error resetting password";
      }
    });

  }
}

