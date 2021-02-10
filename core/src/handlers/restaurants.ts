import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';
import { Restaurants } from '../types';

export const addOpeningHour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const createRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurant: Restaurants = req.body;
    await pool.query(
      'INSERT INTO Restaurants(name, cash_balance) VALUES($1, $2)',
      [restaurant.name, restaurant.cashBalance]
    );
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const addDishToMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listRestaurantsByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const date: Date = new Date(req.params.date);
    const results = await pool.query(
      'SELECT DISTINCT R.name FROM Restaurants R NATURAL JOIN Opening_Hours O WHERE O.weekday = $1 and O.end_time >= $2 and O.start_time <= $2',
      [date.getUTCDay(), date]
    );
    if (results.rowCount == 0) {
      res.status(400).send('No restaurants found');
    } else {
      res.status(200).json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listRestaurantsByAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listRestaurantsByDishPriceRange = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const upperBound = req.query.upper;
    const lowerBound = req.query.lower;
    const numberOfDishes: string = req.params.number;

    let results: QueryResult;
    if (upperBound === undefined && lowerBound === undefined) {
      results = await pool.query(
        'SELECT name FROM Restaurants WHERE id IN (SELECT restaurant_id FROM Items GROUP BY restaurant_id HAVING COUNT(restaurant_id) > $1',
        [numberOfDishes]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        'SELECT name FROM Restaurants WHERE id IN (SELECT restaurant_id FROM Items WHERE price >= $1 GROUP BY restaurant_id HAVING COUNT(restaurant_id) > $2',
        [lowerBound, numberOfDishes]
      );
    } else {
      results = await pool.query(
        'SELECT name FROM Restaurants WHERE id IN (SELECT restaurant_id FROM Items WHERE price >= $1 and price <= $2 GROUP BY restaurant_id HAVING COUNT(restaurant_id) > $3',
        [lowerBound, upperBound, numberOfDishes]
      );
    }

    if (results.rowCount == 0) {
      res.status(400).send('No results found');
    } else {
      res.json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listByName = async (req: Request, res: Response): Promise<any> => {
  try {
    const restaurantName = req.query.restaurant; // restaurant or dish
    const dishName = req.query.dish; // restaurant or dish

    let results: QueryResult;
    if (restaurantName === undefined && dishName === undefined) {
      return res.send(
        'Welcome to foodie restaurants! Please specify dish or restaurant in the query'
      );
    } else if (restaurantName === undefined) {
      results = await pool.query(
        'SELECT DISTINCT name FROM Items WHERE name ilike $1',
        [dishName]
      );
    } else if (dishName === undefined) {
      results = await pool.query(
        'SELECT DISTINCT name FROM Restaurants WHERE name ilike $1',
        [restaurantName]
      );
    } else {
      results = await pool.query(
        'SELECT DISTINCT R.name, I.name FROM Restaurants R NATURAL JOIN Items I WHERE R.name ilike $1 and I.name ilike $2',
        [restaurantName, dishName]
      );
    }

    if (results.rowCount == 0) {
      return res.status(400).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};
