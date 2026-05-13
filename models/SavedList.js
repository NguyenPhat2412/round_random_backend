const mongoose = require("mongoose");

const savedListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SavedList", savedListSchema);
