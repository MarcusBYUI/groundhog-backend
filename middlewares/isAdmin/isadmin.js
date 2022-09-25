const isAdmin = (req, res, next) => {
  if (req.user.level === "ProAdmin") {
    next();
  } else {
    res.status(422).send("Unauthorized");
  }
};

module.exports = isAdmin;
