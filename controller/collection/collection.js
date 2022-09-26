const Joi = require("joi");
const createError = require("http-errors");
const Collection = require("../../models/collection/collection");

const addNFT = async (req, res, next) => {
  const schema = Joi.object().keys({
    nftName: Joi.string().required(),
    image: Joi.string().required(),
    cost: Joi.number().required(),
    percentage: Joi.number().required(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);
    const collection = new Collection({
      nftName: value.nftName,
      image: value.image,
      cost: value.cost,
      percentage: value.percentage,
    });

    const result = await collection.save();

    res.status(200).json({ status: 200, id: result._id });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(createError(422, error.message));
  }
};

const getaAllNFT = async (req, res, next) => {
  try {
    const result = await Collection.find();

    res.status(200).json(result);
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(createError(422, error.message));
  }
};

const deleteNFTById = async (req, res, next) => {
  try {
    const result = await Collection.deleteOne({
      _id: req.params.id,
    });

    if (result.deletedCount < 1) {
      next(createError(422, "Collection does not exist"));
      return;
    }

    res.status(200).json({ status: 200, message: "Delete Successful" });
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid Collection ID"));
      return;
    }
    next(error);
  }
};

module.exports = { addNFT, getaAllNFT, deleteNFTById };
