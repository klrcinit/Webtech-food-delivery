
export interface Order {
  id: number;
  restaurant_name: string;
  estimated_delivery_minutes: number;
  created_at: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total_price: number;
}
