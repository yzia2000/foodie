export interface Restaurant {
  id?: number,
  name: string,
  cashBalance: number
}

export interface Item {
  id?: number,
  restaurant_id: number,
  name: string,
  cashBalance: number,
  price: number
}

export interface OpeningHour {
  weekday: string,
  restaurant_id: number,
  start_time: string,
  end_time: string
}
