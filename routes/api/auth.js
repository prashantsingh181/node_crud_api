const express = require("express");
const { authenticate } = require("../../controllers/authController");
const router = express.Router();

router.route("/").post(authenticate);

module.exports = router;
