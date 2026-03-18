import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// Importamo servis, ki smo ga pravkar uredili
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  standalone: false,
  templateUrl: './restaurants.html',
  styleUrls: ['./restaurants.css']
})
export class Restaurants implements OnInit {

  // Tukaj bomo shranili podatke, ki pridejo iz baze
  restaurants: any[] = [];
  originalRestaurants: any[] = [];
  filteredRestaurants: any[] = [];
  favoriteRestaurants: any[] = [];
  orderedRestaurants: any[] = [];
  popularRestaurants: any[] = [];
  loading: boolean = true;
  selectedCuisine: string = "";
  minRating: number = 0;
  maxDelivery: number = 0;
  maxDistance: number = 0;
  sortOption: string = "";

  constructor(
    private restaurantService: RestaurantService,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("Začenjam nalaganje restavracij...");

    const userId = Number(localStorage.getItem("user_id") || 0);
    this.restaurantService.getRestaurants().subscribe({
      next: (data: any[]) => {

        this.restaurants = [...data];
        this.originalRestaurants = [...data];
        this.filteredRestaurants = [...data];
        this.loading = false;

        this.loadUserFavorites();

        // POPULAR RESTAURANTS (top rated)
        this.popularRestaurants = [...this.restaurants]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);

            // GET USER ORDERS
        this.restaurantService.getOrders(userId).subscribe({
          next: (orders: any[]) => {

            const orderedNames = [...new Set(
              orders.map(o => o.restaurant_name)
            )];

            // Recommend restaurants the user ordered from before
            // COUNT how often each restaurant was ordered
            const orderCount: { [key: string]: number } = {};

            orders.forEach(o => {
              orderCount[o.restaurant_name] =
                (orderCount[o.restaurant_name] || 0) + 1;
            });

// SORT by order frequency
            const sortedNames = Object.entries(orderCount)
              .sort((a, b) => b[1] - a[1])
              .map(entry => entry[0]);

// GET restaurant objects
            this.orderedRestaurants = sortedNames
              .map(name => this.restaurants.find(r => r.name === name))
              .filter(r => r)
              .slice(0, 3);

            // If user has no orders → fallback to top rated
            if (this.orderedRestaurants.length === 0) {
              this.orderedRestaurants = [...this.restaurants]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3);
            }

            this.cdr.detectChanges();
          }
            });

        console.log('Uspeh! Podatki iz baze:', data);
        this.cdr.detectChanges();
        },
      error: (err) => {
        console.error('Napaka pri povezavi:', err);
      }
    });
  }

  loadUserFavorites() {

  const userId = Number(localStorage.getItem("user_id")|| 0);

    this.restaurantService.getFavorites(userId).subscribe((data: any[]) => {


      this.favoriteRestaurants = data;

      this.cdr.detectChanges();

    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
  filterRestaurants() {

    const search = this.selectedCuisine.toLowerCase().trim();

    this.filteredRestaurants = this.restaurants.filter(r => {

      const matchSearch =
        r.name.toLowerCase().includes(search) ||
        r.cuisine.toLowerCase().includes(search);

      const matchRating =
        this.minRating === 0 || r.rating >= this.minRating;

      const matchDelivery =
        this.maxDelivery === 0 || r.delivery_minutes <= this.maxDelivery;

      const matchDistance =
        this.maxDistance === 0 || r.distance_km <= this.maxDistance;

      return matchSearch && matchRating && matchDelivery && matchDistance;

    });

  }
  sortByRating() {

    this.filteredRestaurants.sort((a, b) => b.rating - a.rating);

  }

  sortByDelivery() {
    this.filteredRestaurants.sort((a, b) => a.delivery_minutes - b.delivery_minutes);
  }

  resetFilters() {

    this.selectedCuisine = "";
    this.minRating = 0;
    this.maxDelivery = 0;
    this.maxDistance = 0;
    this.sortOption = "";

    this.filteredRestaurants = [...this.restaurants];

  }
  applySorting() {

    if (this.sortOption === "rating_desc") {
      this.filteredRestaurants = [...this.filteredRestaurants]
        .sort((a, b) => b.rating - a.rating);
    }
    if (this.sortOption === "rating_asc") {
      this.filteredRestaurants = [...this.filteredRestaurants]
        .sort((a, b) => a.rating - b.rating);    }

    if (this.sortOption === "delivery_asc") {
      this.filteredRestaurants = [...this.filteredRestaurants]
        .sort((a, b) => a.delivery_minutes - b.delivery_minutes);
    }
    if (this.sortOption === "delivery_desc") {
      this.filteredRestaurants = [...this.filteredRestaurants]
        .sort((a, b) => b.delivery_minutes - a.delivery_minutes);
    }

    if (this.sortOption === "distance_asc") {
      this.filteredRestaurants = [...this.filteredRestaurants]
        .sort((a, b) => a.distance_km - b.distance_km);    }

    if (this.sortOption === "distance_desc") {
      this.filteredRestaurants = [...this.filteredRestaurants]
        .sort((a, b) => b.distance_km - a.distance_km);
    }

  }
}
