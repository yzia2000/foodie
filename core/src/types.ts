export interface Restaurants {
  id?: number,
  name: string,
  cashBalance: number
}

export interface Items {
  id?: number,
  restaurant_id: number,
  name: string,
  cashBalance: number,
  price: number
}

export interface OpeningHours {
  weekday: string,
  restaurant_id: number,
}
