//coming
//coming
const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../../controller/user/user");
const routes = require("express").Router();

const isAuth = require("../../middlewares/isAuth/isauth");
const isAdmin = require("../../middlewares/isAdmin/isadmin");

routes.get("/", isAuth, getUserById);
routes.get("/users", isAuth, isAdmin, getAllUsers);
routes.put("/", isAuth, isAdmin, updateUser);
routes.delete("/:id", isAuth, isAdmin, deleteUser);

module.exports = routes;
