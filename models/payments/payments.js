//coming
//coming
const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    phone: {
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
    collection: "payment",
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
