const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#FF6B6B",
    },
    icon: {
      type: String,
      default: "🎁",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Tỷ lệ trúng (%) theo từng lượt quay, vd [{ round: 1, rate: 30 }]
    winRates: [
      {
        _id: false,
        round: { type: Number, required: true, min: 1 },
        rate: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Item", itemSchema);
