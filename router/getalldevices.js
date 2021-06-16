const deviceData = require("../database/connect");
module.exports = (req, res) => {
  deviceData.find({}, function (err, doc) {
    if (err) res.send({ status: err });
    else {
      res.send({ count: Object.keys(doc).length, results: doc });
    }
  });
};
