const MongoClient = require("mongodb").MongoClient;
let _db;

const connect = cb => {
  MongoClient.connect(
    "mongodb://localhost:27017/feedBuilder",
    { useNewUrlParser: true },
    (err, db) => {
      _db = db;
      return cb(err);
    }
  );
};

const getDB = () => _db;

module.exports = { connect, getDB };
