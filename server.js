//package
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var db_server = process.env.DB_ENV || "primary";

//mongoose
mongoose.connect("mongodb://127.0.0.1:27017/FrugalDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", function (ref) {
  console.log("Connected to " + db_server + " DB!");

  const app = express();
  app.use(bodyParser.urlencoded({ extended: "false" }));
  app.use(bodyParser.json());
  app.use(express.static("public"));

  //functions
  const setadevice = require("../service3frugal-main/api/v1/routes/setadevice");
  const getalldevices = require("../service3frugal-main/api/v1/routes/getalldevices");
  const getuserdevices = require("../service3frugal-main/api/v1/routes/getuserdevices");
  const getdevice = require("../service3frugal-main/api/v1/routes/getdevice");
  const sensorupload = require("../service3frugal-main/api/v1/routes/sensorupload");
  const deleteDevice = require("../service3frugal-main/api/v1/routes/deletedevice");

  //route
  app.post("/setdevice", function (req, res) {
    setadevice(req, res);
  });

  app.post("/getalldevices", (req, res) => {
    getalldevices(req, res);
  });

  app.post("/getuserdevices", (req, res) => {
    getuserdevices(req, res);
  });

  app.post("/getdevice", (req, res) => {
    getdevice(req, res);
  });

  app.post("/sensorupload/:deviceID", (req, res) => {
    sensorupload(req, res);
  });

  app.delete("/deletedevice", function (req, res) {
    deleteDevice(req, res);
  });

  port = process.env.port || 3000;
  ip = process.env.ip;

  app.listen(port, ip, function () {
    console.log("listening on port " + port);
  });
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.error("Failed to connect to DB " + db_server + " on startup ", err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log(
    "Mongoose default connection to DB :" + db_server + " disconnected"
  );
});

var gracefulExit = function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection with DB :" +
        db_server +
        " is disconnected through app termination"
    );
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
