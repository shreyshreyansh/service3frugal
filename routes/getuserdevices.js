const deviceData = require("../database/connect");
var http = require("http");
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
        getuserDevices(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const getuserDevices = (req, res, jsondata) => {
  if (jsondata.role === "admin" || jsondata.userid === req.body.userid) {
    deviceData.find({ userID: req.body.userid }, function (err, result) {
      if (err) res.send({ status: err });
      else res.send({ count: Object.keys(result).length, results: result });
    });
  } else
    res.send({
      error: "admin access required or given device id not registered",
    });
};
