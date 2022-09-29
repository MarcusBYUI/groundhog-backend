//coming
//coming
const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getPayments,
} = require("../../controller/user/user");
const routes = require("express").Router();

const isAuth = require("../../middlewares/isAuth/isauth");
const isAdmin = require("../../middlewares/isAdmin/isadmin");

routes.get("/", isAuth, getUserById);
routes.get("/users", isAuth, isAdmin, getAllUsers);
routes.put("/", isAuth, isAdmin, updateUser);
routes.delete("/:id", isAuth, isAdmin, deleteUser);
routes.post("/payments", isAuth, isAdmin, getPayments);

module.exports = routes;
