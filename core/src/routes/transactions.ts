import express, { Router } from 'express';
import {
  listTopUsersByTransaction,
  listTopRestaurantsByTransaction,
  listUsersByAmount,
  createTransaction,
} from '../handlers/transactions';

const restaurants: Router = express.Router();

restaurants.get('/users/:number', listTopUsersByTransaction);
restaurants.get('/restaurants/:number', listTopRestaurantsByTransaction);
restaurants.get('/users/dollars/:dollars', listUsersByAmount);

restaurants.post('/', createTransaction);

export default restaurants;
