const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
  Timestamp: Date,
  Type1: String,
  Value1: String,
  Type2: String,
  Value2: String,
  Type3: String,
  Value3: String,
  Type4: String,
  Value4: String,
});

const deviceSchema = mongoose.Schema({
  deviceID: String,
  userID: String,
  username: String,
  deviceType: String,
  datalog: [logSchema],
});

const deviceData = mongoose.model("device", deviceSchema);

module.exports = deviceData;
