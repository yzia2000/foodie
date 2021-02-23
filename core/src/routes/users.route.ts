import express, { Router } from 'express';
import {
  createUser,
  listUsers,
} from '../handlers/users';

const users: Router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     description: List all users
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Returns json object with user name and id.
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
users.get('/', listUsers);

/**
 * @openapi
 * /users:
 *   post:
 *     description: Create user
 *     tags:
 *       - users
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
 *         description: Returns id of created user
 *       404:
 *         description: No data found
 *       400:
 *         description: Bad request
 */
users.post('/', createUser);

export default users;
