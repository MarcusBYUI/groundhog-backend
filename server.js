const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const cors = require("cors");
const Routes = require("./routes");
const passportSetup = require("./config/passport-setup");

const passport = require("passport");
const dotenv = require("dotenv");

const initCronJobs = require("./cronevents/index");

dotenv.config();

//init express and middlewares
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: "https://www.gophermines.com",
  })
);
const PORT = process.env.PORT || 3001;

//passport
app.enable("trust proxy");
app.use(passport.initialize());

//start Cron Job
initCronJobs();

//routes
app.use("/", Routes);

//start server and db
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Connected to DB and listening on ${PORT}`);
  }
});
