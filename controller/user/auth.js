//coming
//coming
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../models/user/user");
const createError = require("http-errors");
const { sendEmail } = require("../../utils/index");
const Token = require("../../models/user/token");

const url = "https://www.gophermines.com/verify/";

const login = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .max(15)
      .regex(
        RegExp(
          /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{6,16}$/
        )
      )
      .required(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    const user = await User.findOne({ email: value.email });

    if (!user) {
      next(createError.UnprocessableEntity("User Not Found"));
      return;
    }

    if (!user.isverified) {
      next(createError.UnprocessableEntity("User Not Verified"));
      return;
    }

    bcrypt.compare(value.password, user.password, function (err, result) {
      if (err) {
        next(createError(422, err.message));
        return;
      }
      if (result) {
        //send token
        user.password = null;
        res.status(200).json({ token: user.generateJWT(), user: user });
      } else {
        next(createError.UnprocessableEntity("Password does not match"));
      }
    });
  } catch (error) {
    next(createError(422, error.message));
  }
};

const logout = async (req, res, next) => {
  req.logout();
  res.send("Logout Succeful");
};

const addUser = async (req, res, next) => {
  const schema = Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .max(15)
      .regex(
        RegExp(
          /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{6,16}$/
        )
      )
      .required(),
    phone: Joi.number().required(),
    haddress: Joi.string().required(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);
    const user = new User({
      fullname: value.fullname,
      email: value.email,
      password: value.password,
      phone: value.phone,
      haddress: value.haddress,
    });

    await user.save();

    sendVerificationEmail(user, req, res, next);
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(createError(422, error.message));
  }
};

const verify = async (req, res, next) => {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync(req.body);
    // Find a matching token
    const token = await Token.findOne({ token: value.token });

    if (!token) {
      next(createError(422, "Invalid or expired token"));
      return;
    }

    // If we found a token, find a matching user
    const user = await User.findOne({ _id: token.userId });

    if (!user) {
      next(createError(422, "User not found"));
      return;
    }

    if (user.isverified == true) {
      return res.status(200).json({ message: "This user has been verified." });
    }

    await User.updateOne({ _id: token.userId }, { $set: { isverified: true } });

    res.status(200).send("The account has been verified.");
  } catch (error) {
    next(createError(422, error));
  }
};

const resendToken = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    const user = await User.findOne({ email: value.email });

    if (user.isverified) {
      return res.status(400).json({
        message: "This account has already been verified. Please log in.",
      });
    }

    await sendVerificationEmail(user, req, res, next);
  } catch (error) {
    next(createError(422, error));
  }
};

const sendVerificationEmail = async (user, req, res, next) => {
  try {
    const token = user.generateVerificationToken();

    // Save the verification token
    await token.save();

    const subject = "Account Verification Token";
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    const code = token.token;
    const html = `<p>Hi ${user.fullname}<p><br><p>Please visit this url: <br> ${url}${code} <br> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

    await sendEmail({ to, from, subject, html });

    res.status(200).json({
      message: "A verification email has been sent to " + user.email + ".",
    });
  } catch (error) {
    next(createError(422, error.message));
  }
};

const recover = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  try {
    const { email } = await schema.validateAsync(req.body);

    const user = await User.findOne({ email });

    if (!user) {
      next(
        createError(
          422,
          "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again."
        )
      );
      return;
    }

    //Generate and set password reset token
    user.generatePasswordReset();

    // Save the updated user object
    await user.save();

    // send email
    let subject = "Password change request";
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let code = user.resetPasswordToken;
    let html = `<p>Hi ${user.fullname}</p>
                    <p>Please use this code: ${code} to reset your password.</p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await sendEmail({ to, from, subject, html });

    res.status(200).json({
      status: 200,
      message: "A reset email has been sent to " + user.email + ".",
    });
  } catch (error) {
    next(createError(422, error.message));
  }
};

const reset = async (req, res, next) => {
  const { token, password } = req.body;

  const schema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string()
      .min(6)
      .max(15)
      .regex(
        RegExp(
          /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{6,16}$/
        )
      )
      .required(),
  });
  try {
    const value = await schema.validateAsync(req.body);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      next(createError(422, "Password reset token is invalid or has expired."));
      return;
    }

    //set new password
    user.password = value.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isverified = true;

    // Save the updated user object
    await user.save();

    //send email
    let subject = "Your password has been changed";
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let html = `<p>Hi ${user.fullname}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`;

    await sendEmail({ to, from, subject, html });

    res
      .status(200)
      .json({ status: 200, message: "Your password has been updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  addUser,
  logout,
  resendToken,
  verify,
  recover,
  reset,
};
