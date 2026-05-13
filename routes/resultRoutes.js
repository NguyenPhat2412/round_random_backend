const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const authenticateToken = require("../middleware/authMiddleware");

// Get all results
router.get("/", resultController.getAllResults);

// Get results by page
router.get("/page/:page", resultController.getResultsByPage);

// Get statistics
router.get("/stats/all", resultController.getResultsStats);

// Delete specific result - PROTECTED
router.delete("/:id", authenticateToken, resultController.deleteResult);

// Clear all results - PROTECTED
router.delete(
  "/clear/all",
  authenticateToken,
  resultController.clearAllResults,
);

module.exports = router;
