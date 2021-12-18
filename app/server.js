const express = require("express");
const http = require("http");
const logger = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const bearerToken = require("express-bearer-token");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const expressValidator = require("express-validator");
const middlewares = require("./middlewares");
const routes = require("./routes");
// const rabbitMqMiddleware = require("./middlewares/rabbitMqMiddleware");
// const setupRabbit = require("./RabbitMQ/setup");

// rabbitMqMiddleware

// require("./services/rabbit/rabbit_mq_setup").openRabbitMqConnection;

// require("./services/rabbit/processor-service")();

const app = express();
app.use(logger("dev"));
app.use(bodyparser.json({ limit: "50mb" }));
app.use(
  bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors());
app.use(helmet());
app.use(bearerToken());
app.use(expressValidator());
app.use(middlewares.ensureContentType);
// app.use(middlewares.rabbitMqMiddleware);
// app.use(middlewares.apiKeyChecker);
app.use(middlewares.jwtAuthChecker);
app.use(routes);
app.use(middlewares.errorHandler);

const server = http.createServer(app);
module.exports = {
  up: (cb) => {
    // let server = app.listen(process.env.PORT);
    console.log("error a");
    server.listen(process.env.PORT || 5000);
    console.log("error b");
    server.on("listening", cb);
    console.log("error c");
    server.on("error", function (err) {
      console.error(err.message.red);
    });

    require("./socketServer").up(server);
  },
};

// // Extended: https://swagger.io/specification/#infoObject
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       version: "1.0.0",
//       title: "Customer Remah",
//       description: "Customer API Information",
//       contact: {
//         name: "Amazing Developer"
//       },
//       servers: ["http://localhost:39654"]
//     }
//   },
//   // ['.routes/*.js']
//   apis: ["server.js", 'routes/*.js']
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// /**
//  * @swagger
//  * /moha/{id}:
//  *    get:
//  *      description: Use to return all customers
//  *    parameters:
//  *      - name: id
//  *        in: path
//  *        description: ID
//  *        required: false
//  *        schema:
//  *          type: integer
//  *    responses:
//  *      '201':
//  *        description: Successfully created user
//  */

// /**
//  * @swagger
//  * /customers:
//  *  post:
//  *    description: Use to post
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  */
