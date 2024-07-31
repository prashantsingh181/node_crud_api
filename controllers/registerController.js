const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

async function registerUser(req, res) {
  const { username, password } = req.body;
  //   if username or password doesn't exist then return
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are necessary." });

  // checking if same username exists in db
  const existingUser = usersDB.users.find((user) => user.username === username);
  if (existingUser)
    return res.status(409).json({ message: "User already exists." });

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUsers = [...usersDB.users, { username, password: hashPassword }];
    usersDB.setUsers(newUsers);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { registerUser };
