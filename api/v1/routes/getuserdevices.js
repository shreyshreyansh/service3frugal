const deviceData = require("../database/model/connect");
const req = require("../functions/request");
const authorization = ["admin"];
module.exports = (request, response) => req(request, response, getuserDevices);

const getuserDevices = (req, res, jsondata) => {
  if (
    authorization.includes(jsondata.role) ||
    jsondata.userid === req.body.userid
  ) {
    deviceData.find({ userID: req.body.userid }, function (err, result) {
      if (err) res.send({ status: err });
      else res.send({ count: Object.keys(result).length, results: result });
    });
  } else
    res.send({
      error: "admin access required or given device id not registered",
    });
};
