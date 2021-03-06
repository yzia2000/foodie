import { RequestHandler } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';
import { Item, OpeningHour, Restaurant } from '../types';

export const addOpeningHour: RequestHandler = async (req, res) => {
  try {
    const opening: OpeningHour = req.body;
    await pool.query(
      'INSERT INTO Opening_Hours(restaurant_id, weekday, start_time, end_time) VALUES($1, $2, $3, $4)',
      [
        opening.restaurantId,
        opening.weekday,
        opening.startTime,
        opening.endTime,
      ]
    );
    res.status(200).send('Opening hour added to restaurant');
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const createRestaurant: RequestHandler = async (req, res) => {
  try {
    const restaurant: Restaurant = req.body;
    const results = await pool.query(
      'INSERT INTO Restaurants(name, cash_balance) VALUES($1, $2) RETURNING id',
      [restaurant.name, restaurant.cashBalance]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const addDishToMenu: RequestHandler = async (req, res) => {
  try {
    const item: Item = req.body;
    const results = await pool.query(
      'INSERT INTO Items(restaurant_id, name, price) VALUES($1, $2, $3) RETURNING id',
      [item.restaurantId, item.name, item.price]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const listRestaurantsByDate: RequestHandler = async (req, res) => {
  try {
    const { date: dateString, time: timeString } = req.query as {
      date: string;
      time: string | undefined;
    };

    if (dateString === undefined) {
      res.status(400).send('Specify date query');
    }

    let results: QueryResult;
    const date: Date = new Date(dateString);
    if (timeString === undefined) {
      results = await pool.query(
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, O.start_time, O.end_time
          FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id 
          WHERE O.weekday = $1`,
        [date.getUTCDay()]
      );
    } else {
      results = await pool.query(
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, O.start_time, O.end_time
          FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id 
          WHERE O.weekday = $1 and O.end_time >= $2 and O.start_time <= $2`,
        [date.getUTCDay(), timeString]
      );
    }

    if (results.rowCount === 0) {
      return res.status(404).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const listRestaurantsByAvailability: RequestHandler = async (
  req,
  res
) => {
  try {
    const { week, day, type } = req.query;
    let results: QueryResult;
    if (type === undefined || type === 'more') {
      if (week === undefined && day === undefined) {
        return res.status(400).send('Please specify week or day in the query');
      } else if (week === undefined) {
        results = await pool.query(
          `SELECT R.id AS restaurant_id, R.name AS restaurant_name
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            WHERE EXTRACT(hours FROM (O.end_time - O.start_time)) >= $1`,
          [day]
        );
      } else {
        results = await pool.query(
          `SELECT foo.id AS restaurant_id, foo.restaurant_name AS restaurant_name
            FROM (SELECT R.id, R.name AS restaurant_name, SUM(EXTRACT(hours FROM (O.end_time - O.start_time))) AS hours
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            GROUP BY R.id) foo
            WHERE foo.hours >= $1`,
          [week]
        );
      }
    } else {
      if (week === undefined && day === undefined) {
        return res.status(400).send('Please specify week or day in the query');
      } else if (week === undefined) {
        results = await pool.query(
          `SELECT R.id AS restaurant_id, R.name AS restaurant_name
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            WHERE EXTRACT(hours FROM (O.end_time - O.start_time)) <= $1`,
          [day]
        );
      } else {
        results = await pool.query(
          `SELECT foo.id AS restaurant_id, foo.restaurant_name AS restaurant_name
            FROM (SELECT R.id, R.name AS restaurant_name, SUM(EXTRACT(hours FROM (O.end_time - O.start_time))) AS hours
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            GROUP BY R.id) foo
            WHERE foo.hours <= $1`,
          [week]
        );
      }
    }

    if (results.rowCount === 0) {
      return res.status(404).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const listRestaurantsByDishPriceRange: RequestHandler = async (
  req,
  res
) => {
  try {
    const { upper: upperBound, lower: lowerBound } = req.query;
    const numberOfDishes: string = req.params.number;

    let results: QueryResult;
    if (upperBound === undefined && lowerBound === undefined) {
      results = await pool.query(
        `SELECT id AS restaurant_id, name AS restaurant_name
          FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            GROUP BY restaurant_id 
            HAVING COUNT(restaurant_id) >= $1)`,
        [numberOfDishes]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        `SELECT id AS restaurant_id, name AS restaurant_name
          FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            WHERE price >= $1 
            GROUP BY restaurant_id 
            HAVING COUNT(restaurant_id) >= $2)`,
        [lowerBound, numberOfDishes]
      );
    } else if (lowerBound === undefined) {
      results = await pool.query(
        `SELECT id AS restaurant_id, name AS restaurant_name
          FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            WHERE price <= $1 
            GROUP BY restaurant_id 
            HAVING COUNT(restaurant_id) >= $2)`,
        [upperBound, numberOfDishes]
      );
    } else {
      results = await pool.query(
        `SELECT id AS restaurant_id, name AS restaurant_name
          FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            WHERE price >= $1 and price <= $2 
            GROUP BY restaurant_id HAVING COUNT(restaurant_id) >= $3)`,
        [lowerBound, upperBound, numberOfDishes]
      );
    }

    if (results.rowCount === 0) {
      return res.status(404).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const listByName: RequestHandler = async (req, res) => {
  try {
    const { restaurant: restaurantName, dish: dishName } = req.query;

    let results: QueryResult;
    if (restaurantName === undefined && dishName === undefined) {
      results = await pool.query(
        'SELECT id AS restaurant_id, name AS restaurant_name FROM Restaurants'
      );
    } else if (restaurantName === undefined) {
      results = await pool.query(
        `SELECT foo.id AS dish_id, foo.name AS dish_name FROM 
          (SELECT id, name
          FROM Items) foo
          WHERE (foo.name <-> $1) < 0.95 
          ORDER BY (foo.name <-> $1)`,
        [dishName]
      );
    } else if (dishName === undefined) {
      results = await pool.query(
        `SELECT foo.id AS dish_id, foo.name AS restaurant_name FROM 
          (SELECT id, name
          FROM Restaurants) foo
          WHERE (foo.name <-> $1) < 0.95 
          ORDER BY (foo.name <-> $1)`,
        [restaurantName]
      );
    } else {
      results = await pool.query(
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, I.id AS dish_id, I.name AS dish_name 
          FROM Restaurants R INNER JOIN Items I ON R.id = I.restaurant_id
          WHERE (R.name <-> $1) < 0.95 and (I.name <-> $2) < 0.95 
          ORDER BY (R.name <-> $1), (I.name <-> $2)`,
        [restaurantName, dishName]
      );
    }

    if (results.rowCount === 0) {
      return res.status(404).send('No results found');
    } else {
      return res.json(results.rows);
    }
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};
