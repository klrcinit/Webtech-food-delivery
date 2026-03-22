import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  // Povezava na tvoj backend
  private apiUrl = 'http://localhost:3000/api/restaurants';

  constructor(private http: HttpClient) {}


  addReview(review:any) {
    return this.http.post("http://localhost:3000/api/reviews", review)
  }

  getReviews(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`)
  }

  // Metoda, ki dejansko pokliče backend
  getRestaurants(){

    return this.http.get<any[]>('http://localhost:3000/api/restaurants');
  }

  getRestaurant(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/restaurants/${id}`)
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>("http://localhost:3000/api/orders");
  }

  getUserReviews(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/users/${userId}/reviews`)
  }

  getFavorites(userId:number){
    return this.http.get<any[]>(
      `http://localhost:3000/api/users/${userId}/favorites`)
  }

  updateUser(userId: number, data: any) {
    return this.http.put(`http://localhost:3000/api/users/${userId}`, data);
  }

}
