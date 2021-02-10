import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';

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
    const name: string = req.body.name;
    const results = await pool.query(
      'SELECT DISTINCT name FROM Items WHERE name ilike $1',
      [name]
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
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listByName = async (
  req: Request,
  res: Response
): Promise<any> => {
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