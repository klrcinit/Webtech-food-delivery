import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  // Povezava na tvoj backend
  private apiUrl = 'http://localhost:3000/api/restaurants';

  constructor(private http: HttpClient) {}

  // Metoda, ki dejansko pokliče backend
  getRestaurants() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRestaurant(id: string) {
    console.log("SERVICE CALLED WITH:", id);
    console.log("FULL URL:", `${this.apiUrl}/${id}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
