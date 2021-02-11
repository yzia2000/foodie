export interface Restaurant {
  id?: number
  name: string
  cashBalance: number
}

export interface Item {
  id?: number
  restaurantId: number
  name: string
  cashBalance: number
  price: number
}

export interface OpeningHour {
  weekday: string
  restaurantId: number
  startTime: string
  endTime: string
}
