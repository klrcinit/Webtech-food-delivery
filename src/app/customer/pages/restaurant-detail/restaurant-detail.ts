import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-restaurant-detail',
  standalone: false,
  templateUrl: './restaurant-detail.html',
  styleUrls: ['./restaurant-detail.css']
})
export class RestaurantDetail implements OnInit {
  restaurant: any = null;
  favorites: any[] = [];
  cartItemCount: number = 0;
  reviews: any[] = [];
  reviewCount: number = 0;
  restaurantRating: number = 0;
  dishRating: number = 0;
  comment: string = "";
  hoverRating: number = 0;
  showReviewForm: boolean = false;
  selectedDish: any = null;
  userId: number = 0;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {
  }
  ngOnInit(): void {

    this.userId = Number(localStorage.getItem("user_id"));    this.restaurantService.getFavorites(this.userId).subscribe(data => {
      this.favorites = data;
    });
    console.log("RestaurantDetail INIT");
    const items = this.cartService.getItems();
    this.cartItemCount = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));
      if (!id) return;

      console.log("ID:", id);

      this.restaurant = null;

      console.log("CALLING getRestaurant with id:", id);

      this.restaurantService.getRestaurant(id).subscribe({
        next: (data) => {
          console.log("RECEIVED RESTAURANT:", data);
          this.restaurant = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR GET RESTAURANT:", err);
        }
      });

      this.restaurantService.getReviews(id).subscribe((data: any[]) => {
        this.reviews = data;
        this.reviewCount = data.length;
        this.cdr.detectChanges();
      });

    });

  }

  reviewDish(dish: any) {

    const review = {
      user_id: this.userId,
      restaurant_id: this.restaurant.id,
      dish_id: dish.id,
      rating: this.dishRating,
      comment: `Review for ${dish.name}`
    };
    this.restaurantService.addReview(review).subscribe(() => {
      dish.rating = this.dishRating;
      setTimeout(() => {
        this.toastService.show("Dish review submitted!", "success");
      });

      // reload restaurant to refresh dish ratings
      this.restaurantService.getRestaurant(this.restaurant.id).subscribe((data:any)=>{
        this.restaurant = data;
        this.cdr.detectChanges();
      });

      this.selectedDish = null;
      this.dishRating = 0;

    });
  }

  addToCart(dish: any) {
    this.cartService.addToCart(dish);
    const items = this.cartService.getItems();

    this.cartItemCount = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }
  submitReview() {

    if (this.restaurantRating === 0) {
      setTimeout(() => {
        this.toastService.show("Please select a rating", "error");
      });
      return;
    }
    if (!this.restaurant) return;

    const review = {
      user_id: this.userId,
      restaurant_id: this.restaurant.id,
      rating: this.restaurantRating,
      comment: this.comment
    };

    this.restaurantService.addReview(review).subscribe(() => {

      setTimeout(() => {
        this.toastService.show("Review submitted!", "success");
      });
      this.restaurantService
        .getReviews(this.restaurant.id)
        .subscribe((data:any[])=>{

          this.reviews = data;
          this.reviewCount = data.length;
          this.cdr.detectChanges();
        });

      this.restaurantService.getFavorites(this.userId).subscribe(data => {
        this.favorites = data;
      });

      // RESET FORM
      this.restaurantRating = 0;
      this.comment = "";
      this.showReviewForm = false;
    });

  }

  protected readonly Math = Math;
}
