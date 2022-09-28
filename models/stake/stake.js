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
    address: {
      type: String,
      required: true,
    },
    stakeROI: {
      type: Number,
      required: true,
    },
    live: {
      type: Boolean,
      default: true,
    },
    totalPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    lastPayment: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentTimes: {
      type: Number,
      required: true,
      default: 0,
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
