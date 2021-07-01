const deviceData = require("../database/model/connect");
const req = require("../functions/request");
const authorization = ["admin"];
module.exports = (request, response) => req(request, response, getdevice);

const getdevice = (req, res, jsondata) => {
  deviceData.findOne({ deviceID: req.body.deviceID }, (err, page) => {
    if (err) res.send({ status: err });
    else {
      if (page) {
        if (
          authorization.includes(jsondata.role) ||
          jsondata.userid === page.userID
        ) {
          res.send(page);
        } else
          res.send({ error: "admin access required or device not registered" });
      } else {
        res.status(400).send({ error: "device not found" });
      }
    }
  });
};
