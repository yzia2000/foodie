import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';
import { Item } from '../types';

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opening  = req.body;
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
    const { upper: upperBound, lower: lowerBound, type } = req.query;
    const dollars = req.params.dollars;

    if (upperBound === undefined || lowerBound === undefined) {
      res.status(400).send('Please specify date upperBound and lowerBound in query');
    }

    let results: QueryResult;

    if (type === undefined || type === 'more') {
      results = await pool.query(
        `SELECT COUNT(DINSTINCT T.user_id)
          FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
          WHERE I.price >= $1 and T.date >= $2 and T.date <= $3
          GROUP BY T.user_id`,
        [dollars, lowerBound, upperBound]
      );
    } else {
      results = await pool.query(
        `SELECT COUNT(DINSTINCT T.user_id)
          FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
          WHERE I.price <= $1 and T.date >= $2 and T.date <= $3
          GROUP BY T.user_id`,
        [dollars, lowerBound, upperBound]
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
    const { upper: upperBound, lower: lowerBound } = req.query;
    const numberOfRestaurants = req.params.number;

    let results: QueryResult;
    if (upperBound === undefined && lowerBound === undefined) {
      results = await pool.query(
        `SELECT R.id, R.name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            GROUP BY I.restaurant_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $1`,
        [numberOfRestaurants]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        `SELECT R.id, R.name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date <= $1
            GROUP BY I.restaurant_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $2`,
        [upperBound, numberOfRestaurants]
      );
    } else if (lowerBound === undefined)
    {
      results = await pool.query(
        `SELECT R.id, R.name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1
            GROUP BY I.restaurant_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $2`,
        [lowerBound, numberOfRestaurants]
      );
    } else {
      results = await pool.query(
        `SELECT R.id, R.name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1 and T.date <= $2
            GROUP BY I.restaurant_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $3`,
        [lowerBound, upperBound, numberOfRestaurants]
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

export const listTopUsersByTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { upper: upperBound, lower: lowerBound } = req.query;
    const numberOfUsers = req.params.number;

    let results: QueryResult;
    if (upperBound === undefined && lowerBound === undefined) {
      results = await pool.query(
        `SELECT U.id, U.name, foo.transaction_amount
          FROM Users U INNER JOIN (SELECT T.user_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            GROUP BY T.user_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $1`,
        [numberOfUsers]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        `SELECT U.id, U.name, foo.transaction_amount
          FROM Users U INNER JOIN (SELECT T.user_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date <= $1
            GROUP BY T.user_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $2`,
        [upperBound, numberOfUsers]
      );
    } else if (lowerBound === undefined)
    {
      results = await pool.query(
        `SELECT U.id, U.name, foo.transaction_amount
          FROM Users U INNER JOIN (SELECT T.user_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1
            GROUP BY T.user_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $2`,
        [lowerBound, numberOfUsers]
      );
    } else {
      results = await pool.query(
        `SELECT U.id, U.name, foo.transaction_amount
          FROM Users U INNER JOIN (SELECT T.user_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1 and T.date <= $2
            GROUP BY T.user_id) foo ON U.id = foo.user_id 
          ORDER BY DESC foo.transaction_amount
          LIMIT $3`,
        [lowerBound, upperBound, numberOfUsers]
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
