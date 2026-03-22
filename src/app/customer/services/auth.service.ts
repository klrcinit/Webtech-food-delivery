import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/login', {
      email,
      password
    });
  }

  register(email: string, password: string, location_x: number, location_y: number, address: string) {
    return this.http.post('http://localhost:3000/api/register', {
      email,
      password,
      location_x,
      location_y,
      address
    });
  }

  changePassword(userId: number, oldPassword: string, newPassword: string) {
    return this.http.put(
      `http://localhost:3000/api/users/${userId}/password`,
      {oldPassword, newPassword},
      {
      }
    );
  }

  resetPassword(email: string, password: string) {
    return this.http.put('http://localhost:3000/api/reset-password', {
      email,
      password
    });
  }

  updateUser(userId:number,data:any){
    return this.http.put(
      `http://localhost:3000/api/users/${userId}`,
      data
    );
  }
  getUser(userId: number) {
    return this.http.get<any>(`http://localhost:3000/api/users/${userId}`);
  }
}
