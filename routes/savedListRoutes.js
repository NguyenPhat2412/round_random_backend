const express = require("express");
const router = express.Router();
const savedListController = require("../controllers/savedListController");
const authenticateToken = require("../middleware/authMiddleware");

// Get all saved lists
router.get("/", savedListController.getAllSavedLists);

// Create or update a saved list - PROTECTED
router.post("/", authenticateToken, savedListController.upsertSavedList);

// Delete a saved list - PROTECTED
router.delete("/:id", authenticateToken, savedListController.deleteSavedList);

module.exports = router;
