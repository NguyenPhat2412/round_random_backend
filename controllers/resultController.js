const Result = require("../models/Result");

// Get all results
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("itemId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get results by page (pagination)
exports.getResultsByPage = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const results = await Result.find()
      .populate("itemId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Result.countDocuments();

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_records: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get results statistics
exports.getResultsStats = async (req, res) => {
  try {
    const totalSpins = await Result.countDocuments();
    const groupedResults = await Result.aggregate([
      {
        $group: {
          _id: "$itemId",
          itemName: { $first: "$itemName" },
          icon: { $first: "$details.icon" },
          color: { $first: "$details.color" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSpins,
        itemStats: groupedResults.map((item) => ({
          itemId: item._id,
          itemName: item.itemName,
          icon: item.icon,
          color: item.color,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear all results
exports.clearAllResults = async (req, res) => {
  try {
    await Result.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All results cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
