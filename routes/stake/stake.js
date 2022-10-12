const {
  stake,
  getStakesById,
  unStake,
  returnNFT,
  getReturnsById,
} = require("../../controller/stake/stake");

const routes = require("express").Router();

const isAuth = require("../../middlewares/isAuth/isauth");

routes.post("/", isAuth, stake);
routes.get("/", isAuth, getStakesById);
routes.post("/unstake", isAuth, unStake);
routes.post("/return", isAuth, returnNFT);
routes.get("/return", isAuth, getReturnsById);

module.exports = routes;
