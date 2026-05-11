const XLSX = require("xlsx");
const Item = require("../models/Item");

// Parse Excel file and extract names
const parseExcelFile = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

// Import items from Excel
const importItemsFromExcel = async (filePath) => {
  try {
    const data = await parseExcelFile(filePath);

    if (data.length === 0) {
      throw new Error("Excel file is empty");
    }

    // Default colors and icons for variety
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];
    const icons = ["🎁", "🎉", "🏆", "⭐", "🎊", "💎", "🎯", "🌟"];

    const items = data.map((row, index) => {
      const nameField = Object.keys(row).find(
        (key) =>
          key.toLowerCase().includes("name") ||
          key.toLowerCase().includes("tên") ||
          key.toLowerCase() === "item",
      );

      const name = nameField ? row[nameField] : row[Object.keys(row)[0]];

      return {
        name: String(name).trim(),
        description: `Prize ${index + 1}`,
        color: colors[index % colors.length],
        icon: icons[index % icons.length],
        isActive: true,
      };
    });

    // Clear old items and insert new ones
    await Item.deleteMany({});
    const createdItems = await Item.insertMany(items);

    return createdItems;
  } catch (error) {
    throw new Error(`Failed to import items: ${error.message}`);
  }
};

module.exports = {
  parseExcelFile,
  importItemsFromExcel,
};
