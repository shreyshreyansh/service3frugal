//package
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//express
const app = express();
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(express.static("public"));

//mongoose
mongoose.connect("mongodb://127.0.0.1:27017/FrugalDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//functions
const setadevice = require("./router/setadevice");
const getalldevices = require("./router/getalldevices");
const getuserdevices = require("./router/getuserdevices");
const getdevice = require("./router/getdevice");
const sensorupload = require("./router/sensorupload");
const deleteDevice = require("./router/deletedevice");

//route
app.post("/setdevice", function (req, res) {
  setadevice(req, res);
});

app.get("/getalldevices", (req, res) => {
  getalldevices(req, res);
});

app.post("/getuserdevices", (req, res) => {
  getuserdevices(req, res);
});

app.get("/getdevice/:deviceID", (req, res) => {
  getdevice(req, res);
});

app.post("/sensorupload/:deviceID", (req, res) => {
  sensorupload(req, res);
});

app.delete("/deletedevice/:deviceID", function (req, res) {
  deleteDevice(req, res);
});

//listening...
app.listen(3000, function () {
  console.log("Server is up and running");
});
