import swaggerJsdoc from 'swagger-jsdoc';
import { __dirname } from "../utils.js";

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Ecommerce Coderhouse API',
      version: '1.0.0',
    },
    tags: [
      {
        name: "products",
        description: "Operations related to products"
      },
      {
        name: "cart",
        description: "Operations related to the shopping cart"
      }
    ],
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
};

export const swaggerSpecs = swaggerJsdoc(options);
