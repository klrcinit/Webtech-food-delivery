import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  newPassword = "";
  message = "";
  loading = false;
  confirmPassword = "";
  showPassword = false;
  passwordStrength = "";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user.email = localStorage.getItem("email") || "";
    this.user.location_x = Number(localStorage.getItem("location_x")) || 0;
    this.user.location_y = Number(localStorage.getItem("location_y")) || 0;
  }

  user: any = {
    email: '',
    location_x: 0,
    location_y: 0
  };

  changePassword(){
    this.message = "";

    if(this.newPassword.length < 6){
      this.message = "Password must be at least 6 characters";
      return;
    }

    if(this.newPassword !== this.confirmPassword){
      this.message = "Passwords do not match";
      return;
    }

    this.loading = true;

    const userId = Number(localStorage.getItem("user_id"));

    this.authService.changePassword(userId,this.newPassword)
      .subscribe({
        next: () => {
          this.message = "Password updated";
          this.loading = false;

          this.newPassword = "";
          this.confirmPassword = "";
          this.passwordStrength = "";

          setTimeout(() => {
            this.message = "";
          }, 3000);
        },
        error: () => {
          this.message = "Error updating password";
          this.loading = false;
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

  updateProfile(){
    this.message = "";
    this.loading = true;
    const userId = Number(localStorage.getItem("user_id"));

    this.authService.updateUser(userId, this.user)
      .subscribe({
        next: () => {
          this.message = "Profile updated";
          this.loading = false;

          setTimeout(() => {
            this.message = "";
          }, 3000);


          // shrani v localStorage
          localStorage.setItem("email", this.user.email);
          localStorage.setItem("location_x", this.user.location_x.toString());
          localStorage.setItem("location_y", this.user.location_y.toString());
        },
        error: () => {
          this.message = "Error updating profile";
          this.loading = false;
        }
      });

  }
}
