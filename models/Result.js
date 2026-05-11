const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    spinTime: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    details: {
      icon: String,
      color: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Result", resultSchema);
