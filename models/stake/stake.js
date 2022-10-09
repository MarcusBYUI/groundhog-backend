//coming
//coming
const mongoose = require("mongoose");

const stakeSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    stakeId: {
      type: String,
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
    address: {
      type: String,
      required: true,
    },
    stakeROI: {
      type: Number,
      required: true,
    },
    stakeEnd: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    live: {
      type: Boolean,
      default: true,
    },

    lastPayment: {
      type: Date,
      required: true,
      default: Date.now,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: false,
    collection: "stake",
  }
);

module.exports = mongoose.model("Stake", stakeSchema);
