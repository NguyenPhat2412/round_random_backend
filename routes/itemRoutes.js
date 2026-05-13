const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authenticateToken = require("../middleware/authMiddleware");

// Get all items
router.get("/", itemController.getAllItems);

// Spin wheel (must be before /:id to avoid route conflict) - PROTECTED
router.post("/spin/wheel", itemController.spinWheel);

// Get item by ID
router.get("/:id", itemController.getItemById);

// Add new item - PROTECTED
router.post("/", authenticateToken, itemController.addItem);

// Update item - PROTECTED
router.put("/:id", authenticateToken, itemController.updateItem);

// Delete item - PROTECTED
router.delete("/:id", authenticateToken, itemController.deleteItem);

module.exports = router;
