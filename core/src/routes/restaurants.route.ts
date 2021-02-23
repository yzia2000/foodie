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

/**
 * @openapi
 * /restaurants:
 *   get:
 *     description: List all restaurants or dishes by name
 *     tags:
 *       - restaurants
 *     parameters:
 *       - name: restaurant
 *         in: query
 *         required: false
 *         type: string
 *         description: Name of restaurant
 *       - name: dish
 *         in: query
 *         required: false
 *         type: string
 *         description: Name of dish
 *     responses:
 *       200:
 *         description: Returns json object with restaurant or dish name and id.
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.get('/', listByName);

/**
 * @openapi
 * /restaurants/open:
 *   get:
 *     description: List all restaurants open by datetime
 *     tags:
 *       - restaurants
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         type: string
 *         description: Date restaurant is open
 *       - name: time
 *         in: query
 *         required: false
 *         type: string
 *         description: time restaurant is open
 *     responses:
 *       200:
 *         description: Returns json object with restaurant name, id and opening hours.
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.get('/open', listRestaurantsByDate);

/**
 * @openapi
 * /restaurants/hours:
 *   get:
 *     description: List restaurants by hour availability
 *     tags:
 *       - restaurants
 *     parameters:
 *       - name: week
 *         in: query
 *         required: false
 *         type: int
 *         description: Number of hours per week
 *       - name: day
 *         in: query
 *         required: false
 *         type: int
 *         description: Number of hours per day
 *       - name: type
 *         in: query
 *         required: false
 *         type: string
 *         description: more or less (default more)
 *     responses:
 *       200:
 *         description: Returns json object with restaurant name and id.
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.get('/hours', listRestaurantsByAvailability);

/**
 * @openapi
 * /restaurants/dishes/{number}:
 *   get:
 *     description: List restaurants by hour availability
 *     tags:
 *       - restaurants
 *     parameters:
 *       - name: number
 *         in: path
 *         required: true
 *         type: int
 *         description: Number of dishes
 *       - name: upper
 *         in: query
 *         required: false
 *         type: int
 *         description: Highest price
 *       - name: lower
 *         in: query
 *         required: false
 *         type: int
 *         description: Lowest price
 *     responses:
 *       200:
 *         description: Returns json object with restaurant name and id.
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.get('/dishes/:number', listRestaurantsByDishPriceRange);

/**
 * @openapi
 * /restaurants:
 *   post:
 *     description: Create restaurant
 *     tags:
 *       - restaurants
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cashBalance:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns id of the restaurant created
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.post('/', createRestaurant);

/**
 * @openapi
 * /restaurants/menu:
 *   post:
 *     description: Add a dish to restaurants menu
 *     tags:
 *       - restaurants
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               restaurantId:
 *                 type: integer
 *               price:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns id of the dish created
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.post('/menu', addDishToMenu);

/**
 * @openapi
 * /restaurants/hours:
 *   post:
 *     description: Add an opening hour to a restaurant
 *     tags:
 *       - restaurants
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekday:
 *                 type: integer
 *               restaurantId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns id of the dish created
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
restaurants.post('/hours', addOpeningHour);

export default restaurants;
