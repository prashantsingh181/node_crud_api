const jwt = require("jsonwebtoken");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

function refreshToken(req, res, next) {
  if (!req.cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = req.cookies.jwt;
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const newAccessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "30s"}
    );
res.json({token: newAccessToken})
  });
}
module.exports = { refreshToken };
