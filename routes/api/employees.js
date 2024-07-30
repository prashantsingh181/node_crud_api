const express = require("express");
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employeesController");
const router = express.Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(createNewEmployee)
  .put(updateEmployee);

router.route("/:id").delete(deleteEmployee);

module.exports = router;
