import swaggerUi from 'swagger-ui-express';
import express, { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

const swagger: Router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Foodie Docs',
      description: 'Minimal API that handles restaurant and user transactions and analytics',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*', './dist/routes/*']
};

const swaggerSpec = swaggerJSDoc(options);

swagger.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default swagger;
