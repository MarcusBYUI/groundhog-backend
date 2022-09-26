//coming
//coming
const mongoose = require("mongoose");

const collectionSchema = mongoose.Schema(
  {
    nftName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: false,
    collection: "collection",
  }
);

module.exports = mongoose.model("Collection", collectionSchema);
