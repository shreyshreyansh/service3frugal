const deviceData = require("../database/model/connect");
const req = require("../functions/request");
const authorization = ["admin"];
module.exports = (request, response) => req(request, response, getalldevices);

const getalldevices = (req, res, jsondata) => {
  if (authorization.includes(jsondata.role)) {
    deviceData.find({}, function (err, doc) {
      if (err) res.send({ status: err });
      else {
        res.send({ count: Object.keys(doc).length, results: doc });
      }
    });
  } else res.send({ error: "admin access required" });
};
