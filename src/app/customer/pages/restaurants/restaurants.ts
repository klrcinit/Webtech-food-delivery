import { Component, OnInit } from '@angular/core';
// Importamo servis, ki smo ga pravkar uredili
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  standalone: false,
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.css'
})
export class Restaurants implements OnInit {

  // Tukaj bomo shranili podatke, ki pridejo iz baze
  restaurants: any[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    console.log("Začenjam nalaganje restavracij...");
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        console.log('Uspeh! Podatki iz baze:', data);
      },
      error: (err) => {
        console.error('Napaka pri povezavi:', err);
      }
    });
  }
}
