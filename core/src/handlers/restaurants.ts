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
      `SELECT DISTINCT R.name 
        FROM Restaurants R NATURAL JOIN Opening_Hours O 
        WHERE O.weekday = $1 and O.end_time >= $2 and O.start_time <= $2`,
      [date.getUTCDay(), date]
    );
    if (results.rowCount === 0) {
      res.status(400).send('No restaurants found');
    } else {
      res.status(200).json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listRestaurantsByUnavailability = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { week, day } = req.query;
    let results: QueryResult;
    if (week === undefined && day === undefined) {
      return res.status(400).send('Please specify week or day in the query');
    } else if (week === undefined) {
      results = await pool.query(
        `SELECT DISTINCT R.name
          FROM Restaurants R NATURAL JOIN Opening_Hours O
          WHERE O.start_time - O.end_time <= $1`, [day]);
    } else {
      results = await pool.query(
        `SELECT DISTINCT R.name
          FROM Restaurants R NATURAL JOIN Opening_Hours O
          GROUP BY R.id
          WHERE SUM(O.start_time - O.end_time) <= $1`, [day]);
    }

    if (results.rowCount === 0) {
      return res.status(400).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listRestaurantsByAvailability = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { week, day } = req.query;
    let results: QueryResult;
    if (week === undefined && day === undefined) {
      return res.status(400).send('Please specify week or day in the query');
    } else if (week === undefined) {
      results = await pool.query(
        `SELECT DISTINCT R.name
          FROM Restaurants R NATURAL JOIN Opening_Hours O
          WHERE O.start_time - O.end_time >= $1`, [day]);
    } else {
      results = await pool.query(
        `SELECT DISTINCT R.name
          FROM Restaurants R NATURAL JOIN Opening_Hours O
          GROUP BY R.id
          WHERE SUM(O.start_time - O.end_time) >= $1`, [day]);
    }

    if (results.rowCount === 0) {
      return res.status(400).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listRestaurantsByDishPriceRange = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { upper: upperBound, lower: lowerBound } = req.query;
    const numberOfDishes: string = req.params.number;

    let results: QueryResult;
    if (upperBound === undefined && lowerBound === undefined) {
      results = await pool.query(
        `SELECT name 
          FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            GROUP BY restaurant_id 
            HAVING COUNT(restaurant_id) > $1`,
        [numberOfDishes]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        `SELECT name FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            WHERE price >= $1 
            GROUP BY restaurant_id 
            HAVING COUNT(restaurant_id) > $2`,
        [lowerBound, numberOfDishes]
      );
    } else {
      results = await pool.query(
        `SELECT name FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            WHERE price >= $1 and price <= $2 
            GROUP BY restaurant_id HAVING COUNT(restaurant_id) > $3)`,
        [lowerBound, upperBound, numberOfDishes]
      );
    }

    if (results.rowCount === 0) {
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
    const restaurantName = req.query.restaurant; // restaurant or item
    const itemName = req.query.item; // restaurant or item

    let results: QueryResult;
    if (restaurantName === undefined && itemName === undefined) {
      results = await pool.query('SELECT DISTINCT name FROM Restaurants');
    } else if (restaurantName === undefined) {
      console.log(itemName);
      results = await pool.query(
        `SELECT foo.name AS item_name FROM 
          (SELECT distinct name 
          FROM Items) foo
          WHERE (foo.name <-> $1) < 0.95 
          ORDER BY (foo.name <-> $1)`,
        [itemName]
      );
    } else if (itemName === undefined) {
      console.log(restaurantName);
      results = await pool.query(
        `SELECT foo.name AS restaurant_name FROM 
          (SELECT distinct name 
          FROM Restaurants) foo
          WHERE (foo.name <-> $1) < 0.95 
          ORDER BY (foo.name <-> $1)`,
        [restaurantName]
      );
    } else {
      results = await pool.query(
        `SELECT R.name AS restaurant_name, I.name AS item_name
          FROM Restaurants R INNER JOIN Items I ON R.id = I.restaurant_id
          WHERE (R.name <-> $1) < 0.95 and (I.name <-> $2) < 0.95 
          ORDER BY (R.name <-> $1), (I.name <-> $2)`,
        [restaurantName, itemName]
      );
    }

    if (results.rowCount === 0) {
      return res.status(400).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};
