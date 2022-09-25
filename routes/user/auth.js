//coming
//coming
const routes = require("express").Router();
const {
  login,
  addUser,
  logout,
  resendToken,
  verify,
  recover,
  reset,
} = require("../../controller/user/auth");

const isAuth = require("../../middlewares/isAuth/isauth");

routes.post("/login", login);
routes.get("/logout", logout);
routes.post("/signup", addUser);
routes.post("/resend", isAuth, resendToken);
routes.post("/verify", isAuth, verify);
routes.post("/recover", recover);
routes.post("/reset", reset);

module.exports = routes;
