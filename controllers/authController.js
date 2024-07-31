const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

// function to authenticate user and send token
async function authenticate(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are necessary" });

  const foundUser = usersDB.users.find((user) => user.username === username);
  if (!foundUser) return res.status(404).json({ message: "User not found." });

  try {
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (isMatch) {
      // json web tokens
      const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // storing refresh token in model
      const newUsers = usersDB.users.map((user) =>
        user.username === foundUser.username ? { ...user, refreshToken } : user
      );
      usersDB.setUsers(newUsers);
      await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
      );

      // sending access token in json with refresh token in http only cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ token: accessToken });
    } else {
      return res.status(401).json({ message: "Invalid password." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { authenticate };
