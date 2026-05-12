const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Login/Register endpoint
router.post("/login", userController.login);

module.exports = router;
