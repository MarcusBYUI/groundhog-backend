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

    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(createError(422, error.message));
  }
};

module.exports = { addNFT, getaAllNFT };
