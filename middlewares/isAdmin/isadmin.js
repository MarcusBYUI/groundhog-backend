const isAdmin = (req, res, next) => {
  if (req.user.level === "admin") {
    next();
  } else {
    res.status(422).send("Unauthorized");
  }
};

module.exports = isAdmin;
