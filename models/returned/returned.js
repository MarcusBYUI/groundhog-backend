//coming
//coming
const mongoose = require("mongoose");

const returnSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    nftId: {
      type: Number,
      required: true,
    },
    nftName: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentIn: {
      type: Number,
      required: true,
    },
    amount: {
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
    collection: "return",
  }
);

module.exports = mongoose.model("Returned", returnSchema);
