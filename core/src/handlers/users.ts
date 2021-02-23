import { RequestHandler } from 'express';
import pool from '../db';
import { User } from '../types';

export const createUser: RequestHandler = async (req, res) => {
  try {
    const user: User = req.body;
    const results = await pool.query(
      'INSERT INTO Users(name, cash_balance) VALUES($1, $2) RETURNING id',
      [user.name, user.cashBalance]
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};

export const listUsers: RequestHandler = async (_req, res) => {
  try {
    const results = await pool.query(
      'SELECT id, name from Users'
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).send('Invalid request');
  }
};
