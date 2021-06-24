const deviceData = require("../../../database/model/connect");
const req = require("../../../functions/request");
module.exports = (request, response) => req(request, response, createDevice);

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
