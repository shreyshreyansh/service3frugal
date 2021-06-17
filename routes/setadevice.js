var http = require("http");
const deviceData = require("../database/connect");
module.exports = (request, response) => {
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
