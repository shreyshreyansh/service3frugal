const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var http = require("http");

const app = express();
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/FrugalDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

var conn = mongoose.connection;

const logSchema = mongoose.Schema({
  Timestamp: Date,
  Type1: String,
  Value1: String,
  Type2: String,
  Value2: String,
  Type3: String,
  Value3: String,
  Type4: String,
  Value4: String,
});

const deviceSchema = mongoose.Schema({
  deviceID: String,
  userID: String,
  username: String,
  deviceType: String,
  datalog: [logSchema],
});

const deviceData = mongoose.model("device", deviceSchema);

//----------------------user setting the device----------------------//

app.post("/setdevice", function (req, res) {
  checkIfTokenValidAndCreateUser(req, res);
});

const checkIfTokenValidAndCreateUser = (request, response) => {
  var data = JSON.stringify({ token: request.body.tokenid });
  var options = {
    host: "localhost",
    port: "4000",
    path: "/istokenvalid",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };
  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    res.on("data", (d) => {
      var jsondata = JSON.parse(d);
      if (jsondata.status == 0) {
        response.send({ error: "token id expired or incorrect" });
      } else {
        createDevice(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const createDevice = (req, res, jsondata) => {
  const deviceID = req.body.deviceID;
  const deviceType = req.body.deviceType;
  const userID = jsondata.userid;
  const userName = jsondata.username;
  var device = {
    deviceID: deviceID,
    userID: userID,
    username: userName,
    deviceType: deviceType,
    datalog: [],
  };
  deviceData.create(device, function (err, result) {
    if (err) res.send({ status: err });
    else res.send(result);
  });
};

//-------------------------get all the listed device--------------------//

app.get("/getalldevices", function (req, res) {
  deviceData.find({}, function (err, doc) {
    if (err) res.send({ status: err });
    else {
      res.send({ count: Object.keys(doc).length, results: doc });
    }
  });
});

//------------------------get all the device of a user-----------------------//

app.post("/getuserdevices", function (req, res) {
  checkIfTokenValidAndGetDevice(req, res);
});

const checkIfTokenValidAndGetDevice = (request, response) => {
  var data = JSON.stringify({ token: request.body.tokenid });
  var options = {
    host: "localhost",
    port: "4000",
    path: "/istokenvalid",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };
  const req = http.request(options, (res) => {
    res.on("data", (d) => {
      var jsondata = JSON.parse(d);
      if (jsondata.status == 0) {
        response.send({ error: "token id expired or incorrect" });
      } else {
        getDevice(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const getDevice = (req, res, jsondata) => {
  const userID = jsondata.userid;
  deviceData.find({ userID: userID }, function (err, result) {
    if (err) res.send({ status: err });
    else res.send({ count: Object.keys(result).length, results: result });
  });
};

//-----------------------get a particular device---------------------//

app.get("/getdevice/:deviceID", function (req, res) {
  deviceData.findOne({ deviceID: req.params.deviceID }, (err, page) => {
    if (err) res.send({ status: err });
    else {
      if (page) {
        res.send(page);
      } else {
        res.status(400).send({ status: "Device Id not found" });
      }
    }
  });
});

//-----------------------sensor data uploading--------------------------//

app.post("/sensorupload/:deviceID", function (req, res) {
  var day = new Date();
  var stamp = day.toISOString();
  const type1 = req.body.Type1;
  const value1 = req.body.Value1;
  const type2 = req.body.Type2;
  const value2 = req.body.Value2;
  const type3 = req.body.Type3;
  const value3 = req.body.Value3;
  const type4 = req.body.Type4;
  const value4 = req.body.Value4;
  var tes = {
    Timestamp: stamp,
    Type1: type1,
    Value1: value1,
    Type2: type2,
    Value2: value2,
    Type3: type3,
    Value3: value3,
    Type4: type4,
    Value4: value4,
  };
  var deviceID = req.params.deviceID;
  deviceData.findOne({ deviceID: deviceID }, (err, page) => {
    if (err) res.send({ status: err });
    else {
      if (page) {
        var log = page.datalog;
        log.push(tes);
        deviceData.updateOne(
          { deviceID: deviceID },
          { $set: { datalog: log } },
          function (err, doc) {
            if (err) res.send({ status: err });
            else res.redirect("/getdevice/" + deviceID);
          }
        );
      } else {
        res.status(400).send({ status: "Device Id not found" });
      }
    }
  });
});

//-------------------update a specific device------------------------//
app.post("/updatedevice/:deviceID", function (req, res) {
  var deviceObject = req.body;
  var deviceID = req.params.deviceID;
  deviceData.findOne({ deviceID: deviceID }, (err, page) => {
    if (err) res.send({ status: err });
    else {
      if (page) {
        var deviceType =
          deviceObject.deviceType == undefined
            ? page.deviceType
            : deviceObject.deviceType;
        deviceData.updateOne(
          { deviceID: deviceID },
          { $set: { deviceType: deviceType } },
          function (err, doc) {
            if (err) res.send({ status: err });
            else res.send({ status: "update successful", result: page });
          }
        );
      } else {
        res.status(400).send({ error: "Device Id not found" });
      }
    }
  });
});

//-------------------delete a device--------------------//

app.delete("/deletedevice/:deviceID", function (req, res) {
  checkIfTokenValidAndDeleteDevice(req, res);
});

const checkIfTokenValidAndDeleteDevice = (request, response) => {
  var data = JSON.stringify({ token: request.body.tokenid });
  var options = {
    host: "localhost",
    port: "4000",
    path: "/istokenvalid",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };
  const req = http.request(options, (res) => {
    res.on("data", (d) => {
      var jsondata = JSON.parse(d);
      if (jsondata.status == 0) {
        response.send({ error: "token id expired or incorrect" });
      } else {
        deleteDevice(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const deleteDevice = (req, res, jsondata) => {
  const userID = jsondata.userid;
  deviceData.findOneAndDelete(
    { userID: userID, deviceID: req.params.deviceID },
    function (err, result) {
      if (err) res.send({ status: err });
      else res.send({ satus: "deletion successful" });
    }
  );
};

app.listen(3000, function () {
  console.log("Server is up and running");
});
