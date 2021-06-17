const deviceData = require("../database/connect");

module.exports = (req, res) => {
  var day = new Date();
  var stamp = day.toISOString();
  const type1 = req.body.Type1;
  const value1 = req.body.Value1;
  const type2 = req.body.Type2;
  const value2 = req.body.Value2;
  const type3 = req.body.Type3;
  const value3 = req.body.Value3;
  const type4 = req.body.Type4;
  const value4 = req.body.Value4;
  var tes = {
    Timestamp: stamp,
    Type1: type1,
    Value1: value1,
    Type2: type2,
    Value2: value2,
    Type3: type3,
    Value3: value3,
    Type4: type4,
    Value4: value4,
  };
  var deviceID = req.params.deviceID;
  deviceData.findOne({ deviceID: deviceID }, (err, page) => {
    if (err) res.send({ status: err });
    else {
      if (page) {
        var log = page.datalog;
        log.push(tes);
        deviceData.updateOne(
          { deviceID: deviceID },
          { $set: { datalog: log } },
          function (err, doc) {
            if (err) res.send({ status: err });
            else res.redirect("/getdevice/" + deviceID);
          }
        );
      } else {
        res.status(400).send({ status: "Device Id not found" });
      }
    }
  });
};
