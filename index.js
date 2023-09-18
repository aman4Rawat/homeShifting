const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require('path');


const user = require("./routes/userroutes.js");
const admin = require("./routes/adminroutes.js");
const service = require("./routes/servicesroutes.js");
const vendor = require("./routes/vendorroutes.js");
const payment = require("./routes/paymentrouter.js");


var dataDate = new Date();
dataDate.setUTCHours(0,0,0,0)
try {
  const app = express();
  app.use(express.static('uploads'));
  app.use("/image",express.static('image'));
  app.use("/gallery",express.static('gallery'));
  app.use("/invoice",express.static('invoice'));
  app.use(helmet());
  app.use(compression());
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
  app.get("/farhan", (req, res) => {
    console.log("apis working fine...")
    res.send("House Shifting Apis");
  });
   app.use("/user", user);
   app.use("/admin", admin);
   app.use("/service",service);
   app.use("/vendor",vendor);
   app.use("/payment",payment);
  
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
