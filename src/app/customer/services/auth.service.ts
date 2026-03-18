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

  changePassword(userId: number, password: string) {
    const token = localStorage.getItem("token");
    return this.http.put(
      `http://localhost:3000/api/users/${userId}/password`,
      {password},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

    const token = localStorage.getItem("token");

    return this.http.put(
      `http://localhost:3000/api/users/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
