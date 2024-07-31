const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders) return res.sendStatus(401);
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    next();
  });
}

module.exports = verifyJWT;
