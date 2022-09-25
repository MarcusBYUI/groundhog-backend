//coming
//coming
const passport = require("passport");
const User = require("../models/user/user");
const createError = require("http-errors");
const passportJwt = require("passport-jwt");
const strategyJwt = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new strategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({ _id: payload.id });
        done(null, user);
      } catch (error) {
        done(createError(422, error.message));
      }
    }
  )
);
