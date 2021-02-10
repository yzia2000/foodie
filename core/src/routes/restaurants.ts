import express, { Router } from 'express';
import {
  addOpeningHour,
  createRestaurant,
  addDishToMenu,
  listRestaurantsByDate,
  listRestaurantsByAvailability,
  listRestaurantsByDishPriceRange,
  listByName,
  listDishByName
} from '../handlers/restaurants';

const restaurants: Router = express.Router();

restaurants.get('/', listByName);
restaurants.get('/dishes', listDishByName);
restaurants.get('/date', listRestaurantsByDate);
restaurants.get('/time', listRestaurantsByAvailability);
restaurants.get('/dishes', listRestaurantsByDishPriceRange);

restaurants.post('/', createRestaurant);
restaurants.post('/menu', addDishToMenu);
restaurants.post('/hours', addOpeningHour);

export default restaurants;
