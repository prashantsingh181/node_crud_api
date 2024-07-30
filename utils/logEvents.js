const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// function to log the message with current timestamp and unique id
async function logEvents(message, fileName) {
  const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    // if the log directory doesn't exist then making one
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      logItem
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = logEvents;
