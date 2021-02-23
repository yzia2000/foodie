import express, { Router } from 'express';
import {
  listTopUsersByTransaction,
  listTopRestaurantsByTransaction,
  listUsersByAmount,
  createTransaction,
  getAllTransactions,
} from '../handlers/transactions';

const transactions: Router = express.Router();

/**
 * @openapi
 * /transactions:
 *   get:
 *     description: List all transactions
 *     tags:
 *       - transactions
 *     responses:
 *       200:
 *         description: Returns json object with transactions
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
transactions.get('/', getAllTransactions);

/**
 * @openapi
 * /transactions/users/{number}:
 *   get:
 *     description: List all top users with total transactions in a date range
 *     tags:
 *       - transactions
 *     parameters:
 *       - name: number
 *         in: path
 *         required: true
 *         type: string
 *         description: Number of users
 *       - name: upper
 *         in: query
 *         required: false
 *         type: string
 *         description: Highest date
 *       - name: lower
 *         in: query
 *         required: false
 *         type: string
 *         description: Lowest date
 *     responses:
 *       200:
 *         description: Returns json object with transaction amount user id and name
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
transactions.get('/users/:number', listTopUsersByTransaction);

/**
 * @openapi
 * /transactions/restaurants/{number}:
 *   get:
 *     description: List all top restaurants with total transactions in a date range
 *     tags:
 *       - transactions
 *     parameters:
 *       - name: number
 *         in: path
 *         required: true
 *         type: string
 *         description: Number of restaurants
 *       - name: upper
 *         in: query
 *         required: false
 *         type: string
 *         description: Highest date
 *       - name: lower
 *         in: query
 *         required: false
 *         type: string
 *         description: Lowest date
 *     responses:
 *       200:
 *         description: Returns json object with transaction amount, restaurant id and name
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
transactions.get('/restaurants/:number', listTopRestaurantsByTransaction);

/**
 * @openapi
 * /transactions/users/dollars/{dollars}:
 *   get:
 *     description: List number of users with single transaction amount more or less in a date range
 *     tags:
 *       - transactions
 *     parameters:
 *       - name: dollars
 *         in: path
 *         required: true
 *         type: string
 *         description: Amount of dollars
 *       - name: upper
 *         in: query
 *         required: true
 *         type: string
 *         description: Highest date
 *       - name: lower
 *         in: query
 *         required: true
 *         type: string
 *         description: Lowest date
 *       - name: type
 *         in: query
 *         required: false
 *         type: string
 *         description: more or less (default more)
 *     responses:
 *       200:
 *         description: Return number of users
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
transactions.get('/users/dollars/:dollars', listUsersByAmount);

/**
 * @openapi
 * /transactions:
 *   post:
 *     description: Commit a transaction
 *     tags:
 *       - transactions
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               itemId:
 *                 type: integer
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns json with transaction details
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
transactions.post('/', createTransaction);

export default transactions;
