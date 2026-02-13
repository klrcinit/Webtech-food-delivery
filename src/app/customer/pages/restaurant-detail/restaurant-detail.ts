import { Component, OnInit} from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-restaurant-detail',
  standalone: false,
  templateUrl: './restaurant-detail.html',
  styleUrls: ['./restaurant-detail.css']
})
export class RestaurantDetail implements OnInit {
  restaurant: any = null;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      console.log("ID:", id);

      if (!id) {
      console.log("ID is null — route param not found");
      return;
    }

    this.restaurantService.getRestaurant(id).subscribe({
      next: (data) => {
        console.log("RESPONSE:", data);
        this.restaurant = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("HTTP ERROR:", err);
      }
    });


  }

  addToCart(dish: any) {
    this.cartService.addToCart(dish);
  }
}
