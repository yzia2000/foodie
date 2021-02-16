import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import RestaurantsRoute from './routes/restaurants';
import TransactionRoute from './routes/transactions';
import SwaggerRoute from './routes/swagger';

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use('/restaurants', RestaurantsRoute);
app.use('/transactions', TransactionRoute);
app.use('/api-docs', SwaggerRoute);

export default app;
