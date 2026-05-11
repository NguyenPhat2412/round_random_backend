const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const { importItemsFromExcel } = require("../utils/excelParser");

// Middleware to handle file uploads
router.use(fileUpload());

// Import items from Excel
router.post("/import-excel", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.files.file;
    const uploadPath = `${__dirname}/../uploads/${file.name}`;

    // Create uploads directory if it doesn't exist
    const fs = require("fs");
    const uploadDir = `${__dirname}/../uploads`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move file to uploads directory
    await file.mv(uploadPath);

    // Parse and import
    const items = await importItemsFromExcel(uploadPath);

    // Delete the file after importing
    fs.unlinkSync(uploadPath);

    res.status(201).json({
      success: true,
      data: items,
      message: `Successfully imported ${items.length} items`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
