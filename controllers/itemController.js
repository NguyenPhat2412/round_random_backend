const Item = require("../models/Item");
const Result = require("../models/Result");

const AUTO_COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#eab308",
  "#ef4444",
];

const getAutoColor = () =>
  AUTO_COLORS[Math.floor(Math.random() * AUTO_COLORS.length)];

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add single item
exports.addItem = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Item name is required",
      });
    }

    const newItem = await Item.create({
      name,
      description: description || "",
      color: color || getAutoColor(),
      icon: icon || "🎁",
    });

    res.status(201).json({
      success: true,
      data: newItem,
      message: "Item added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, isActive } = req.body;

    const existingItem = await Item.findById(id);

    const item = await Item.findByIdAndUpdate(
      id,
      {
        name: name ?? existingItem?.name,
        description: description ?? existingItem?.description,
        color: color ?? existingItem?.color,
        icon: icon ?? existingItem?.icon,
        isActive: isActive !== undefined ? isActive : existingItem?.isActive,
      },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
      message: "Item updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Spin wheel - get random item
exports.spinWheel = async (req, res) => {
  try {
    const items = await Item.find({ isActive: true });

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items available to spin",
      });
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];

    // Save result
    const result = await Result.create({
      itemId: selectedItem._id,
      itemName: selectedItem.name,
      spinTime: new Date().getTime(),
      result: selectedItem.name,
      details: {
        icon: selectedItem.icon,
        color: selectedItem.color,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        item: selectedItem,
        result: result,
      },
      message: "Spin completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
