const express = require("express");
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employeesController");
const verifyJWT = require("../../middleware/verifyJWT");
const router = express.Router();

router
  .route("/")
  .get(verifyJWT, getAllEmployees)
  .post(createNewEmployee)
  .put(updateEmployee);

router.route("/:id").delete(deleteEmployee);

module.exports = router;
