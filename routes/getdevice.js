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
        getdevice(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const getdevice = (req, res, jsondata) => {
  deviceData.findOne({ deviceID: req.body.deviceID }, (err, page) => {
    if (err) res.send({ status: err });
    else {
      if (page) {
        if (jsondata.role === "admin" || jsondata.userid === page.userID) {
          res.send(page);
        } else
          res.send({ error: "admin access required or device not registered" });
      } else {
        res.status(400).send({ error: "device not found" });
      }
    }
  });
};
