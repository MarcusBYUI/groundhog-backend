//coming
//coming
const mongoose = require("mongoose");
const User = require("../../models/user/user");
const Payment = require("../../models/payments/payments");
const { Parser } = require("json2csv");

const createError = require("http-errors");
const Joi = require("joi");

//get a user
//update user address
//claim diamond

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      next(createError(422, "user does not exist"));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(createError(422, error.message));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();

    if (user.length < 1) {
      next(createError(422, "No Users"));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(createError(422, error.message));
  }
};

const updateUser = async (req, res, next) => {
  const document = {};
  const keys = ["userid", "amount"];

  //get the values from body
  for (const key in req.body) {
    if (typeof req.body[key] !== "undefined" && keys.includes(key)) {
      document[key] = req.body[key];
    }
  }

  // check the number of items sent for update
  if (Object.keys(document).length < 1) {
    next(createError(422, "Please provide information to be updated"));
    return;
  }

  const schema = Joi.object().keys({
    userid: Joi.string().required(),
    amount: Joi.number().required(),
  });

  try {
    const value = await schema.validateAsync(document);

    const user = await User.findById(value.userid);

    const updateResult = await User.updateOne(
      {
        _id: value.userid,
      },
      { $set: { pendingPaid: 0, totalPaid: user.totalPaid + value.amount } }
    );

    const payment = new Payment({
      name: user.fullname,
      address: user.address,
      email: user.email,
      amount: value.amount,
      phone: user.phone,
    });

    await payment.save();

    return updateResult.modifiedCount > 0
      ? //if update went through
        res.status(200).json({ status: 200, message: "successful" })
      : // if
      updateResult.matchedCount < 1
      ? //if product does not exist
        next(createError(422, "User does not exist"))
      : // product exist but nothing was updated
        res.status(200).send(`No update was made`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(createError(422, error.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.deleteOne({ _id: req.params.id });

    if (user.deletedCount > 0)
      res.status(200).json({ status: 200, message: "user deleted" });
    else res.status(422).json({ status: 422, message: "No user deleted" });
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(createError(422, error.message));
  }
};

const getPayments = async (req, res, next) => {
  const schema = Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
  });

  try {
    const value = await schema.validateAsync(req.body);
    const payment = await Payment.find({
      date: { $gte: new Date(value.from), $lt: new Date(value.to) },
    });

    const fields = [
      "_id",
      "name",
      "address",
      "email",
      "amount",
      "phone",
      "date",
    ];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(payment);
    res.type("text/csv").attachment("payments.csv").send(csv);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(createError(422, error.message));
  }
};
module.exports = {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  getPayments,
};
