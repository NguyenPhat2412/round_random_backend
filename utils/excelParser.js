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

    const newItems = data.map((row, index) => {
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

    // Get all existing items
    const existingItems = await Item.find({});
    const newItemNames = new Set(
      newItems.map((item) => item.name.toLowerCase()),
    );
    const existingItemNames = new Map(
      existingItems.map((item) => [item.name.toLowerCase(), item._id]),
    );

    // Update or deactivate existing items
    const updatePromises = existingItems.map((existingItem) => {
      const isInNewList = newItemNames.has(existingItem.name.toLowerCase());
      return Item.findByIdAndUpdate(
        existingItem._id,
        { isActive: isInNewList },
        { new: true },
      );
    });

    // Add new items
    const newItemNames2 = newItems.filter(
      (newItem) => !existingItemNames.has(newItem.name.toLowerCase()),
    );
    const createdItems = await Item.insertMany(newItemNames2);

    // Wait for all updates and get final list
    await Promise.all(updatePromises);

    // Return all active items after import
    const finalItems = await Item.find({ isActive: true });
    return finalItems;
  } catch (error) {
    throw new Error(`Failed to import items: ${error.message}`);
  }
};

module.exports = {
  parseExcelFile,
  importItemsFromExcel,
};
