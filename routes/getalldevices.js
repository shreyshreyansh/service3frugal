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
        getalldevices(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const getalldevices = (req, res, jsondata) => {
  if (jsondata.role === "admin") {
    deviceData.find({}, function (err, doc) {
      if (err) res.send({ status: err });
      else {
        res.send({ count: Object.keys(doc).length, results: doc });
      }
    });
  } else res.send({ error: "admin access required" });
};
