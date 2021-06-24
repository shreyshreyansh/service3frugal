const deviceData = require("../../../database/model/connect");
const req = require("../../../functions/request");
module.exports = (request, response) => req(request, response, deleteDevice);

const deleteDevice = (req, res, jsondata) => {
  const userID = jsondata.userid;
  deviceData.findOneAndDelete(
    { userID: userID, deviceID: req.body.deviceID },
    function (err, result) {
      if (err) res.send({ status: err });
      else res.send({ satus: "deletion successful" });
    }
  );
};
