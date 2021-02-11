import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = await pool.connect();
  try {
    const { itemId, userId, date = new Date().toLocaleDateString() } = req.body;

    await client.query('BEGIN');
    const itemPriceQuery: QueryResult = await client.query(
      'SELECT price FROM Items WHERE id = $1',
      [itemId]
    );
    if (itemPriceQuery.rowCount === 0) {
      throw new Error('Incorrect itemId');
    }
    const itemPrice = itemPriceQuery.rows[0].price;

    const userUpdateQuery: QueryResult = await client.query(
      'UPDATE Users SET cash_balance = cash_balance - $1 WHERE id = $2 RETURN *',
      [itemPrice, userId]
    );

    if (userUpdateQuery.rowCount === 0) {
      throw new Error('Incorrect userId');
    }

    await client.query(
      'INSERT INTO Transactions(user_id, item_id, date) VALUES($1, $2, $3)',
      [userId, itemId, date]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(403).send(error.Message);
  } finally {
    client.release();
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
      res
        .status(400)
        .send('Please specify date upperBound and lowerBound in query');
    }

    let results: QueryResult;

    if (type === undefined || type === 'more') {
      results = await pool.query(
        `SELECT COUNT(DISTINCT T.user_id) AS total
          FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
          WHERE I.price >= $1 and T.date >= $2 and T.date <= $3
          `,
        [dollars, lowerBound, upperBound]
      );
    } else {
      results = await pool.query(
        `SELECT COUNT(DISTINCT T.user_id) AS total
          FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
          WHERE I.price <= $1 and T.date >= $2 and T.date <= $3
          `,
        [dollars, lowerBound, upperBound]
      );
    }

    if (results.rowCount === 0) {
      res.status(400).send('No users found');
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
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            GROUP BY I.restaurant_id) foo ON R.id = foo.restaurant_id 
          ORDER BY foo.transaction_amount DESC
          LIMIT $1`,
        [numberOfRestaurants]
      );
    } else if (lowerBound === undefined) {
      results = await pool.query(
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date <= $1
            GROUP BY I.restaurant_id) foo ON R.id = foo.restaurant_id           
          ORDER BY foo.transaction_amount DESC
          LIMIT $2`,
        [upperBound, numberOfRestaurants]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1
            GROUP BY I.restaurant_id) foo ON R.id = foo.restaurant_id           
          ORDER BY foo.transaction_amount DESC
          LIMIT $2`,
        [lowerBound, numberOfRestaurants]
      );
    } else {
      results = await pool.query(
        `SELECT R.id AS restaurant_id, R.name AS restaurant_name, foo.transaction_amount
          FROM Restaurants R INNER JOIN (SELECT I.restaurant_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1 and T.date <= $2
            GROUP BY I.restaurant_id) foo ON R.id = foo.restaurant_id           
          ORDER BY foo.transaction_amount DESC
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
          ORDER BY foo.transaction_amount DESC
          LIMIT $1`,
        [numberOfUsers]
      );
    } else if (lowerBound === undefined) {
      results = await pool.query(
        `SELECT U.id, U.name, foo.transaction_amount
          FROM Users U INNER JOIN (SELECT T.user_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date <= $1
            GROUP BY T.user_id) foo ON U.id = foo.user_id 
          ORDER BY foo.transaction_amount DESC
          LIMIT $2`,
        [upperBound, numberOfUsers]
      );
    } else if (upperBound === undefined) {
      results = await pool.query(
        `SELECT U.id, U.name, foo.transaction_amount
          FROM Users U INNER JOIN (SELECT T.user_id, SUM(I.price) AS transaction_amount
            FROM Transactions T INNER JOIN Items I ON I.id = T.item_id
            WHERE T.date >= $1
            GROUP BY T.user_id) foo ON U.id = foo.user_id 
          ORDER BY foo.transaction_amount DESC
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
          ORDER BY foo.transaction_amount DESC
          LIMIT $3`,
        [lowerBound, upperBound, numberOfUsers]
      );
    }

    if (results.rowCount === 0) {
      res.status(400).send('No users found');
    } else {
      res.json(results.rows);
    }
  } catch (error) {
    res.status(403).send('Something went wrong');
  }
};
