const deviceData = require("../database/connect");
const http = require("http");
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
