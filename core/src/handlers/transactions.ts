import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';
import { Item } from '../types';

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opening: OpeningHour = req.body;
    await pool.query(
      'INSERT INTO Opening_Hours(restaurant_id, weekday, start_time, end_time) VALUES($1, $2, $3)',
      [opening.restaurant_id, opening.weekday, opening.start_time, opening.end_time]
    );
    res.status(200).send('Opening hour added to restaurant');
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listUsersByAmount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { date: dateString, time: timeString } = req.query;
    if (dateString === undefined) {
      res.status(402).send('Specify date query');
    } 

    let results: QueryResult;
    if (timeString === undefined) {
      let date: Date = new Date(dateString + "");
      results = await pool.query(
        `SELECT DISTINCT R.name, O.start_time, O.end_time
          FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id 
          WHERE O.weekday = $1`,
        [date.getUTCDay()]
      );
    } else {
      let date: Date = new Date(dateString + "");
      results = await pool.query(
        `SELECT DISTINCT R.name, O.start_time, O.end_time
          FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id 
          WHERE O.weekday = $1 and O.end_time >= $2 and O.start_time <= $2`,
        [date.getUTCDay(), timeString]
      );
    }
    if (results.rowCount === 0) {
      res.status(400).send('No restaurants found');
    } else {
      res.status(200).json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};

export const listTopRestaurantsByTransaction = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { week, day, type } = req.query;
    let results: QueryResult;
    if (type === undefined || type === 'more') {
      if (week === undefined && day === undefined) {
        return res.status(400).send('Please specify week or day in the query');
      } else if (week === undefined) {
        results = await pool.query(
          `SELECT DISTINCT R.name AS restaurant_name
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            WHERE EXTRACT(hours FROM (O.end_time - O.start_time)) >= $1`, [day]);
      } else {
        results = await pool.query(
          `SELECT foo.restaurant_name
            FROM (SELECT R.name AS restaurant_name, SUM(EXTRACT(hours FROM (O.end_time - O.start_time))) AS hours
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            GROUP BY R.id) foo
            WHERE foo.hours >= $1`, [week]);
      }
    } else {
      if (week === undefined && day === undefined) {
        return res.status(400).send('Please specify week or day in the query');
      } else if (week === undefined) {
        results = await pool.query(
          `SELECT DISTINCT R.name AS restaurant_name
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            WHERE EXTRACT(hours FROM (O.end_time - O.start_time)) <= $1`, [day]);
      } else {
        results = await pool.query(
          `SELECT foo.restaurant_name
            FROM (SELECT R.name AS restaurant_name, SUM(EXTRACT(hours FROM (O.end_time - O.start_time))) AS hours
            FROM Restaurants R INNER JOIN Opening_Hours O ON R.id = O.restaurant_id
            GROUP BY R.id) foo
            WHERE foo.hours <= $1`, [week]);
      }
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

export const listTopUsersByTransaction = async (
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
            HAVING COUNT(restaurant_id) >= $1)`,
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
            HAVING COUNT(restaurant_id) >= $2)`,
        [lowerBound, numberOfDishes]
      );
    } else if (lowerBound === undefined)
    {
      results = await pool.query(
        `SELECT name FROM Restaurants 
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
        `SELECT name FROM Restaurants 
          WHERE id IN 
            (SELECT restaurant_id 
            FROM Items 
            WHERE price >= $1 and price <= $2 
            GROUP BY restaurant_id HAVING COUNT(restaurant_id) >= $3)`,
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