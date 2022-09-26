//coming
//coming
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("Db is already initialized!");
    return callback(null, _db);
  }
  mongoose
    .connect(
      `mongodb+srv://${process.env.USER}:${process.env.PASS}@free.mr9c9.mongodb.net/groundhog`
    )
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Db not initialized");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};
