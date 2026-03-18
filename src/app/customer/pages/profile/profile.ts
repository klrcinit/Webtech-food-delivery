import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  email = "";
  newPassword = "";
  message = "";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const email = localStorage.getItem("email");
    this.email = email || "";
  }

  changePassword(){

    if(this.newPassword.length < 6){
      this.message = "Password must be at least 6 characters";
      return;
    }

    const userId = Number(localStorage.getItem("user_id"));

    this.authService.changePassword(userId,this.newPassword)
      .subscribe({
        next: () => {
          this.message = "Password updated";
        },
        error: () => {
          this.message = "Error updating password";
        }
      });

  }

  updateProfile(){

    const userId = Number(localStorage.getItem("user_id"));

    const data = {
      email: this.email
    };

    this.authService.updateUser(userId,data)
      .subscribe({
        next: () => {
          this.message = "Profile updated";
          localStorage.setItem("email", this.email);
        },
        error: () => {
          this.message = "Error updating profile";
        }
      });

  }
}
