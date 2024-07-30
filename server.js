const express = require("express");
const logger = require("./middleware/logger");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3500;

// custom logger middleware
app.use(logger);

// express middleware to parse the json
app.use(express.json());

// route for employees
app.use("/employees", require("./routes/api/employees"));

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
