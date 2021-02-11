import express, { Router } from 'express';
import {
  addOpeningHour,
  createRestaurant,
  addDishToMenu,
  listRestaurantsByDate,
  listRestaurantsByAvailability,
  listRestaurantsByDishPriceRange,
  listByName,
} from '../handlers/restaurants';

const restaurants: Router = express.Router();

restaurants.get('/', listByName);
restaurants.get('/open', listRestaurantsByDate);
restaurants.get('/hours', listRestaurantsByAvailability);
restaurants.get('/dishes/:number', listRestaurantsByDishPriceRange);

restaurants.post('/', createRestaurant);
restaurants.post('/menu', addDishToMenu);
restaurants.post('/hours', addOpeningHour);

export default restaurants;
