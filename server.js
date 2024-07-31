const express = require("express");
const logger = require("./middleware/logger");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3500;

// custom logger middleware
app.use(logger);

// express middleware to parse the json
app.use(express.json());

// third party middleware to parse the cookies
app.use(cookieParser());

// route for employees
app.use("/employees", require("./routes/api/employees"));

// route for registration
app.use("/register", require("./routes/api/register"));

// route for authentication
app.use("/authenticate", require("./routes/api/auth"));

app.use("/refreshToken", require("./routes/api/refreshToken"))

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
