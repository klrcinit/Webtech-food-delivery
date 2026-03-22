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

  lockUntil: Date | null = null;
  countdown: number = 0;
  private countdownInterval: any;
  clickBlockedMessage: string = "";

  email = "";
  password = "";
  errorMessage = "";
  loading: boolean = false;
  remainingAttempts: number = 5;
  isErrorShake: boolean = false;
  success: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {

    if (localStorage.getItem("token")) {
      this.router.navigate(['/customer/restaurants']);
    }

    const savedLock = localStorage.getItem("lock_until");

    if (savedLock) {
      this.lockUntil = new Date(savedLock);

      if (this.lockUntil.getTime() > Date.now()) {
        this.startCountdown();
      } else {
        localStorage.removeItem("lock_until");
      }
    }

  }

  login() {

    this.validateInputs();

    if (!this.email || !this.password) {
      return;
    }

    this.clickBlockedMessage = "";

    if (this.loading) {
      this.clickBlockedMessage = "Please wait...";
      return;
    }

    console.log("LOGIN ROUTE UPDATED VERSION RUNNING");
    console.log("LOGIN CLICKED");

    this.errorMessage = "";
    this.loading = true;

    this.authService.login(this.email, this.password)
      .subscribe({

        next: (user: any) => {

          this.loading = false;
          this.remainingAttempts = 5;

          this.success = true;


          localStorage.setItem("token", user.token);
          localStorage.setItem("user_id", user.id);
          localStorage.setItem("email", user.email);
          localStorage.setItem("role", user.role);

          setTimeout(() => {
            if (user.role === "owner") {
              this.router.navigate(['/owner/dashboard']);
            } else {
              this.router.navigate(['/customer/restaurants']);
            }
          }, 700);
        },

        error: (err) => {

          this.loading = false;

            // trigger shake safely
            this.isErrorShake = true;
            setTimeout(() => this.isErrorShake = false, 400);

          if (err.status === 401) {

            const attemptsLeft = err.error?.attempts_left;

            if (attemptsLeft !== undefined) {
              this.remainingAttempts = attemptsLeft;
            }

            this.errorMessage =
              `Invalid email or password. ${this.remainingAttempts} attempts left.`;

            this.cdr.detectChanges();
          }

            else if (err.status === 403 && err.error?.lock_until) {
            this.loading = false;
              this.errorMessage = err.error.error;

              this.lockUntil = new Date(err.error.lock_until);
              localStorage.setItem("lock_until", this.lockUntil.toISOString());

              this.startCountdown();
            }

            else if (err.status === 400) {
              this.errorMessage = err.error?.error || "Please enter email and password";
            }

            else {
              this.errorMessage = "Something went wrong";
            }

        }
      });
  }
  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {

      if (!this.lockUntil) return;

      const now = new Date().getTime();
      const lockTime = this.lockUntil.getTime();

      this.countdown = Math.max(0, Math.floor((lockTime - now) / 1000));
this.cdr.detectChanges();
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.lockUntil = null;
        this.errorMessage = "";
        localStorage.removeItem("lock_until");
      }

    }, 1000);
  }
  validateInputs() {
    if (!this.email || !this.password) {
      this.errorMessage = "Email and password required";
    } else {
      this.errorMessage = "";
    }
  }
}
