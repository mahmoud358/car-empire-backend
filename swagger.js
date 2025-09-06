const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Empire API Documentation',
      version: '1.0.0',
      description: 'API documentation for Car Empire project',
    },
    servers: [
      {
        url: 'https://car-empire-backend.vercel.app',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, 'routes/*.js'),
    path.join(__dirname, 'routes/user.js'),
    path.join(__dirname, 'routes/blog.js'),
    path.join(__dirname, 'routes/job.js'),
    path.join(__dirname, 'routes/supplier.js'),
    path.join(__dirname, 'routes/car.js')
  ], // More explicit paths for better compatibility
};

module.exports = swaggerJsdoc(options);