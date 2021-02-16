import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import RestaurantsRoute from './routes/restaurants.route';
import TransactionRoute from './routes/transactions.route';
import SwaggerRoute from './routes/swagger.route';
import UsersRoute from './routes/users.route';

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use('/restaurants', RestaurantsRoute);
app.use('/transactions', TransactionRoute);
app.use('/users', UsersRoute);
app.use(SwaggerRoute);

export default app;
