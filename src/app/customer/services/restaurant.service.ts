import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  // Povezava na tvoj backend
  private apiUrl = 'http://localhost:3000/api/restaurants';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {

    const token = localStorage.getItem("token");

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };

  }

  addReview(review:any) {
    return this.http.post("http://localhost:3000/api/reviews", review,
    this.getAuthHeaders());
  }

  getReviews(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`,
    this.getAuthHeaders());
  }

  // Metoda, ki dejansko pokliče backend
  getRestaurants(userId:number){

    return this.http.get<any[]>(
      `http://localhost:3000/api/restaurants?user_id=${userId}`,
      this.getAuthHeaders()
    );

  }

  getRestaurant(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/restaurants/${id}`,
    this.getAuthHeaders());
  }

  getOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/orders/${userId}`,
    this.getAuthHeaders());
  }

  getUserReviews(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/users/${userId}/reviews`,
    this.getAuthHeaders());
  }

  getFavorites(userId:number){
    return this.http.get<any[]>(
      `http://localhost:3000/api/users/${userId}/favorites`
       ,this.getAuthHeaders());

  }

  updateUser(userId: number, data: any) {
    return this.http.put(`/api/users/${userId}`, data);
  }

}
