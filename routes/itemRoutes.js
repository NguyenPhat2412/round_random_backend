const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Get all items
router.get("/", itemController.getAllItems);

// Add new item
router.post("/", itemController.addItem);

// Update item
router.put("/:id", itemController.updateItem);

// Delete item
router.delete("/:id", itemController.deleteItem);

// Spin wheel
router.post("/spin/wheel", itemController.spinWheel);

module.exports = router;
