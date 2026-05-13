const mongoose = require("mongoose");
const SavedList = require("../models/SavedList");

// Get all saved lists
exports.getAllSavedLists = async (req, res) => {
  try {
    const savedLists = await SavedList.find().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: savedLists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create or update saved list by name
exports.upsertSavedList = async (req, res) => {
  try {
    const { name, items } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên danh sách là bắt buộc",
      });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Danh sách mục phải là mảng",
      });
    }

    const normalizedItems = items
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    if (!normalizedItems.length) {
      return res.status(400).json({
        success: false,
        message: "Danh sách không được để trống",
      });
    }

    const savedList = await SavedList.findOneAndUpdate(
      { name: String(name).trim() },
      {
        name: String(name).trim(),
        items: normalizedItems,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      data: savedList,
      message: "Đã lưu danh sách thành công",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Tên danh sách đã tồn tại",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete saved list
exports.deleteSavedList = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Danh sách không tồn tại",
      });
    }

    const deleted = await SavedList.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Danh sách không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa danh sách thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
