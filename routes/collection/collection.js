//coming
//coming
const routes = require("express").Router();
const {
  addNFT,
  getaAllNFT,
  deleteNFTById,
} = require("../../controller/collection/collection");

const isAuth = require("../../middlewares/isAuth/isauth");
const isAdmin = require("../../middlewares/isAdmin/isadmin");

routes.post("/", isAuth, isAdmin, addNFT);
routes.get("/", getaAllNFT);
routes.get("/delete/:id", deleteNFTById);

module.exports = routes;
