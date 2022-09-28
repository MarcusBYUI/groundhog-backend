const { stake, payUser } = require("../../controller/stake/stake");

const routes = require("express").Router();

routes.post("/", stake);
routes.post("/paid", payUser);

module.exports = routes;
