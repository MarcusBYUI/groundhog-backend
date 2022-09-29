//coming
//coming
const { getUserById, getAllUsers } = require("../../controller/user/user");
const routes = require("express").Router();

const isAuth = require("../../middlewares/isAuth/isauth");
const isAdmin = require("../../middlewares/isAdmin/isadmin");

routes.get("/", isAuth, getUserById);
routes.get("/users", isAuth, isAdmin, getAllUsers);

module.exports = routes;
