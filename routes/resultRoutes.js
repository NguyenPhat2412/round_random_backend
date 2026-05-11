const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// Get all results
router.get("/", resultController.getAllResults);

// Get results by page
router.get("/page/:page", resultController.getResultsByPage);

// Get statistics
router.get("/stats/all", resultController.getResultsStats);

// Delete specific result
router.delete("/:id", resultController.deleteResult);

// Clear all results
router.delete("/clear/all", resultController.clearAllResults);

module.exports = router;
