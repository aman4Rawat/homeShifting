const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:3001'
  };
  
  const outputFile = './swagger.json';
  const routes = ['./index.js'];
  
  swaggerAutogen(outputFile, routes, doc);