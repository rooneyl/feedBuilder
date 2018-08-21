const MongoClient = require("mongodb").MongoClient;
const reqlib = require("app-root-path").require;
const logger = reqlib("/config/logger");

const url = "mongodb://localhost:27017";
const collectionList = "collectionList";
const dbName = "feedBuilder";

let _db;

const connect = () => {
  const parser = { useNewUrlParser: true };
  const client = new MongoClient(url, parser);
  return new Promise(resolve => {
    client.connect(err => {
      if (err) {
        reject(err);
      }
      _db = client.db(dbName);
      resolve(_db);
    });
  });
};

const collection = async target => {
  const { title, link, description } = target.feed;
  const pubDate = new Date().toGMTString();

  try {
    const targetCollection = _db.collection(collectionList);
    const setTargetQuery = { $set: { link, description, pubDate } };
    const upsert = true;
    await targetCollection.updateOne({ title }, setTargetQuery, { upsert });
    logger.info("DB - collectionList updated -> " + title);
  } catch (err) {
    logger.error("DB - collectionList update failed -> " + title);
    throw err;
  }

  const targetCollection = _db.collection(title);
  const currentSize = await targetCollection.find().count();
  if (currentSize == 0) {
    logger.info("DB - collection[" + title + "] does not exist");
    logger.info("DB - creating capped collection[" + title + "]");
    const capped = { capped: true, size: 524288, max: 50 };
    try {
      await _db.createCollection(title, capped);
      logger.info("DB - collection[" + title + "] created");
    } catch (err) {
      logger.error("DB - failed to create collection[" + title + "]");
      throw err;
    }
  }
};

const getDB = collection => _db.collection(collection);

module.exports = { connect, collection, getDB };
