const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Get all items
router.get("/", itemController.getAllItems);

// Spin wheel (must be before /:id to avoid route conflict)
router.post("/spin/wheel", itemController.spinWheel);

// Get item by ID
router.get("/:id", itemController.getItemById);

// Add new item
router.post("/", itemController.addItem);

// Update item
router.put("/:id", itemController.updateItem);

// Delete item
router.delete("/:id", itemController.deleteItem);

module.exports = router;
