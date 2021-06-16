const deviceData = require("../database/connect");
module.exports = (req, res) => {
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
};
