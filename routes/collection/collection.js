//coming
//coming
const routes = require("express").Router();
const { addNFT } = require("../../controller/collection/collection");

const isAuth = require("../../middlewares/isAuth/isauth");
const isAdmin = require("../../middlewares/isAdmin/isadmin");

routes.post("/", isAuth, isAdmin, addNFT);

module.exports = routes;
