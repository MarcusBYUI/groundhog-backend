//coming
//coming
const { getUserById } = require("../../controller/user/user");
const routes = require("express").Router();

const isAuth = require("../../middlewares/isAuth/isauth");

routes.get("/", isAuth, getUserById);

module.exports = routes;
