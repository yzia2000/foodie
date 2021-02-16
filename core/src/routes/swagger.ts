import swaggerUi from 'swagger-ui-express';
import express, { Router } from 'express';

const swagger: Router = express.Router();

swagger.use('/api-docs', swaggerUi.serve);
export default swagger;
