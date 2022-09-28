const {
  stake,
  payUser,
  getStakesById,
} = require("../../controller/stake/stake");

const routes = require("express").Router();

const isAuth = require("../../middlewares/isAuth/isauth");

routes.post("/", isAuth, stake);
routes.get("/", isAuth, getStakesById);
routes.post("/paid", payUser);

module.exports = routes;
