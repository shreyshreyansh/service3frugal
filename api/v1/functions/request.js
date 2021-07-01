const jwt = require("jsonwebtoken");
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
module.exports = (request, response, cb) => {
  validateToken(request.body.tokenid, JWT_SECRET).then(
    function (result) {
      if (result) cb(request, response, result);
      else response.send({ error: "token id expired or incorrect" });
    },
    function (error) {
      res.send(error);
    }
  );
};

async function validateToken(token, secret) {
  try {
    const result = jwt.verify(token, secret);
    return {
      success: "tokenid valid",
      userid: result.userid,
      username: result.username,
      role: result.role,
      iat: result.iat,
      exp: result.exp,
      status: 1,
    };
  } catch (ex) {
    return null;
  }
}
