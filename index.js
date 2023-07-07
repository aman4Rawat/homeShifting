const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
dotenv.config();


const user = require("./routes/userroutes.js");


var dataDate = new Date();
dataDate.setUTCHours(0,0,0,0)
try {
  const app = express();
  app.use(express.static('uploads'))
  app.use(helmet());
  app.use(compression());
//   const options = {
//     swaggerDefinition: {
//       info: {
//         description: "API documentation for LMS exam API",
//         title: "LMS Exam API",
//         version: "1.0.0",
//       },
//       // host: `dev.armax.com:${DATASTOREPORT}`,
//       basePath: "",
//       produces: ["application/json", "application/xml"],

//       // schemes: schemeshttpmethod,
//       securityDefinitions: {
//         JWT: {
//           type: "apiKey",
//           in: "header",
//           name: "Authorization",
//           description: "",
//         },
//       },
//     },
//     basedir: __dirname, // app absolute path
//     files: ["./routes/**/*.js"], // Path to the API handle folder
//   };

//   const expressSwagger = expressSwaggerGenerator(app);
//   expressSwagger(options);
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
  app.use(cors());

  app.use(bodyParser.json());


  module.exports =app;
  app.get("/", (req, res) => {
    res.send("House Shifting Apis");
  });
 ; 
   app.use("/user", user);
  
  mongoose.set('strictQuery', false);
  (async () => {
    try {
        const mongoUri = process.env.MONGOCONNECTIONSTRING;
        mongoose.connect(mongoUri, {
         useNewUrlParser: true,
         useUnifiedTopology: true
        });
        console.error('mongo is connected');
        app.listen(process.env.PORT || process.env.APPLICATIONPORT ,() => {
            console.log(`Server Running on Port : ${process.env.APPLICATIONPORT}`);
          });
    } catch (err) {
        console.error('Internal Server Error', err);
    }
})();

    
} catch (error) {
  console.log(error);
}
