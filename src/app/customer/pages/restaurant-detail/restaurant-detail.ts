import { Component, OnInit} from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-restaurant-detail',
  standalone: false,
  templateUrl: './restaurant-detail.html',
  styleUrl: './restaurant-detail.css',
})
export class RestaurantDetail implements OnInit {
  restaurant: any = null;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurantService.getRestaurant(id).subscribe({
        next: (data) => this.restaurant = data,
        error: (err) => console.error(err)
      });
    }
  }

  addToCart(dish: any) {
    this.cartService.addToCart(dish);
  }
}
