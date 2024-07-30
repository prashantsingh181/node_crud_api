const fsPromises = require("fs").promises;
const path = require("path");

const employeesDB = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

// function to return all employees in model
const getAllEmployees = (req, res) => {
  res.send(employeesDB.employees);
};

// function to create a new employee
const createNewEmployee = async (req, res) => {
  const { firstName, lastName } = req.body;
  // return the function if no first name or last name
  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: "First name and Last name are necessary." });

  const newEmployees = [
    ...employeesDB.employees,
    {
      id: employeesDB.employees.at(-1).id + 1,
      firstName,
      lastName,
    },
  ];
  employeesDB.setEmployees(newEmployees);
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "employees.json"),
      JSON.stringify(employeesDB.employees)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  res.status(201).json(employeesDB.employees);
};

// function to update the employee information
const updateEmployee = async (req, res) => {
  const { id, firstName, lastName } = req.body;
  // return the function if no id in request body
  if (!id) return res.status(400).json({ message: "Id is necessary." });

  // finding employee in our model
  const foundEmployee = employeesDB.employees.find(
    (employee) => employee.id === id
  );

  // return 404 if employee not found in model
  if (!foundEmployee)
    return res.status(404).json({ message: "Employee does not exist" });

  const newEmployees = employeesDB.employees.map((employee) => {
    if (employee.id === id) {
      firstName && (employee.firstName = firstName);
      lastName && (employee.lastName = lastName);
    }
    return employee;
  });

  employeesDB.setEmployees(newEmployees);
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "employees.json"),
      JSON.stringify(employeesDB.employees)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  return res.json(employeesDB.employees);
};

// function to delete the employee information from model
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  // return the function if no id in request parameters
  if (!id) return res.status(400).json({ message: "Id is necessary." });

  const foundEmployee = employeesDB.employees.find(
    (employee) => employee.id === parseInt(id)
  );

  if (!foundEmployee)
    return res.status(404).json({ message: "Employee does not exist" });

  const newEmployees = employeesDB.employees.filter(
    (employee) => employee.id !== parseInt(id)
  );

  employeesDB.setEmployees(newEmployees);
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "employees.json"),
      JSON.stringify(employeesDB.employees)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  return res.json(newEmployees);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
