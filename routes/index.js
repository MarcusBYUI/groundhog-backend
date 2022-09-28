//coming
//coming
const routes = require("express").Router();
const createError = require("http-errors");
const UsersRoute = require("./user/users");
const authRoute = require("./user/auth");
const collectionRoute = require("./collection/collection");
const stakeRoute = require("./stake/stake");

//auth
routes.use("/auth", authRoute);

//user/users route
routes.use("/user", UsersRoute);

//collection route
routes.use("/collection", collectionRoute);

//stake route
routes.use("/stake", stakeRoute);

//404 error handler
routes.use((req, res, next) => {
  next(createError.NotFound("Not Found"));
});

//error handler
routes.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = routes;
