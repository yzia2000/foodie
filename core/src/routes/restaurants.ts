import express, { Router } from 'express';
import {
  addOpeningHour,
  createRestaurant,
  addDishToMenu,
  listRestaurantsByDate,
  listRestaurantsByAvailability,
  listRestaurantsByUnavailability,
  listRestaurantsByDishPriceRange,
  listByName
} from '../handlers/restaurants';

const restaurants: Router = express.Router();

restaurants.get('/', listByName);
restaurants.get('/date', listRestaurantsByDate);
restaurants.get('/hours/more', listRestaurantsByAvailability);
restaurants.get('/hours/less', listRestaurantsByUnavailability);
restaurants.get('/dishes/:number', listRestaurantsByDishPriceRange);

restaurants.post('/', createRestaurant);
restaurants.post('/menu', addDishToMenu);
restaurants.post('/hours', addOpeningHour);

export default restaurants;
