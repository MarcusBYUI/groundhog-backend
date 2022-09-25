//coming
//coming
const mongoose = require("mongoose");
const User = require("../../models/user/user");
const createError = require("http-errors");

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

const updateUser = async (req, res, next) => {
  const document = {};
  const keys = ["address"];

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
    address: Joi.array().required(),
  });

  try {
    const value = await schema.validateAsync(document);

    const updateResult = await User.updateOne(
      {
        _id: req.user._id,
      },
      { $set: value }
    );

    return updateResult.modifiedCount > 0
      ? //if update went through
        res
          .status(200)
          .send(`User with Id ${req.params.id} was updated succesfully`)
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

const claimDiamond = async (req, res, next) => {
  //get user
  try {
    const user = await User.findOne({ _id: req.user._id });
    const settings = await Settings.findOne({ name: "settings" });

    console.log(user.lastclaimed);

    // const update = {
    //   diamond: user.diamond + settings.diamonds * user.multiplier,

    // };
  } catch (error) {}
};

module.exports = { getUserById, updateUser };
