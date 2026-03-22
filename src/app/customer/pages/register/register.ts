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
  passwordStrength = "";
  showPassword = false;
  confirmPassword = "";
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {
  }

  register() {

    this.errorMessage = "";

    if (!this.address || this.address.trim() === "") {
      this.errorMessage = "City is required";
      return;
    }

    if (!this.email.includes("@") || !this.email.includes(".")) {
      this.errorMessage = "Invalid email";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = "Password must be at least 6 characters";
      return;
    }

    this.loading = true;

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
        localStorage.setItem("email", this.email);
        localStorage.setItem("address", this.address);

        this.errorMessage = "Registration successful! Please log in.";
        this.loading = false;
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
        this.address = "";
        this.passwordStrength = "";

        setTimeout(() => {
          this.router.navigate(['/customer/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
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
  getPasswordStrength(password: string): string {

    if (!password) return "";

    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2) return "Medium";
    return "Strong";
  }
}






