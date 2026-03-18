import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false,
  styleUrls: ['./register.css']
})
export class Register {

  email = "";
  password = "";
  address = "";
  location_x = 5;
  location_y = 5;
  errorMessage = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {
  }

  register() {

    this.errorMessage = "";

    const location_x = Math.floor(Math.random() * 10);
    const location_y = Math.floor(Math.random() * 10);

    this.authService.register(
      this.email,
      this.password,
      location_x,
      location_y,
      this.address,
    ).subscribe({

      next: () => {
        alert("Registration successful. Please log in.");

        this.router.navigate(['/customer/login']);

      },

      error: (err) => {

        console.log("Register error:", err);

        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = "Registration failed";
        }

        this.cdr.detectChanges();

      }

    });
  }
}






