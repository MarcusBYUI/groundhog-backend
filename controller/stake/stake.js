const { ethers, BigNumber } = require("ethers");
const Joi = require("joi");
const createError = require("http-errors");

const Stake = require("../../models/stake/stake");
const User = require("../../models/user/user");

const {
  stakeABI,
  stakeContract,
  nftContract,
  nftABI,
} = require("../../utils/index");

//stake NFT
const stake = async (req, res, next) => {
  const schema = Joi.object().keys({
    stakeId: Joi.string().required(),
    address: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync(req.body);

    const provider = new ethers.providers.WebSocketProvider(
      `wss://ws-nd-401-019-821.p2pify.com/${process.env.CHAINSTACK}`
    );

    const contract = new ethers.Contract(stakeContract, stakeABI, provider);
    const result = await contract.stakedNFTs(value.stakeId);

    //compare senders address with stakers address
    if (value.address !== result[1]) {
      next(createError.UnprocessableEntity("Inconsistent staking parameters"));
      return;
    }

    const tokenId = BigNumber.from(`${result[3]}`).toString();

    //get % from the token contract
    const tokenContract = new ethers.Contract(nftContract, nftABI, provider);
    const tokenResult = await tokenContract.stakingROI(tokenId);
    const stakeROI = JSON.parse(tokenResult);

    //add address to user if not present
    if (req.user.address === 0) {
      console.log("gothere");
      await User.updateOne(
        {
          _id: req.user._id,
        },
        { $set: { address: value.address } }
      );
    }

    const stake = new Stake({
      user: req.user._id,
      stakeId: value.stakeId,
      address: value.address,
      stakeROI,
    });

    await stake.save();

    res.json({ status: 200, message: "Stake Successful" });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(createError(422, error.message));
  }
};
const payUser = async (req, res, next) => {};

//getStaked NFTs for User
const getStakesById = async (req, res, next) => {
  try {
    const result = await Stake.find({
      user: req.user._id,
    });

    if (result.length < 1) {
      next(createError(422, "No stakes for User"));
      return;
    }

    const filteredArr = result.filter((item) => item.live === true);

    res.status(200).json({ status: 200, data: filteredArr });
  } catch (error) {
    next(error);
  }
};

const unStake = async (req, res, next) => {
  const schema = Joi.object().keys({
    stakeId: Joi.string().required(),
  });

  const value = await schema.validateAsync(req.body);
  try {
    const updateResult = await Stake.updateOne(
      {
        user: req.user._id,
        stakeId: value.stakeId,
      },
      { $set: { live: false } }
    );

    return updateResult.modifiedCount > 0
      ? //if update went through
        res.status(200).json({ status: 200, message: "Updated" })
      : // if
      updateResult.matchedCount < 1
      ? //if product does not exist
        next(createError(422, "User does not exist"))
      : // product exist but nothing was updated
        res.status(200).send(`No update was made`);
  } catch (error) {
    next(error);
  }
};

module.exports = { stake, payUser, getStakesById, unStake };
