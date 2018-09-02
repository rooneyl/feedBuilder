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
    return new Promise((resolve) => {
        client.connect((err) => {
            if (err) {
                reject(err);
            }
            _db = client.db(dbName);
            resolve(_db);
        });
    });
};

const collection = async (target) => {
    const pubDate = new Date().toGMTString();

    const { title, link, description } = target;
    try {
        const targetCollection = _db.collection(collectionList);
        const setTargetQuery = { $set: { title, link, description, pubDate } };
        const upsert = true;
        await targetCollection.updateOne({ _id: target.id }, setTargetQuery, {
            upsert
        });
        logger.info("DB - collectionList updated -> " + target.id);
    } catch (err) {
        logger.error("DB - collectionList update failed -> " + target.id);
        throw err;
    }

    const targetCollection = _db.collection(target.id);
    const currentSize = await targetCollection.find().count();
    if (currentSize == 0) {
        logger.info("DB - collection[" + target.id + "] does not exist");
        logger.info("DB - creating capped collection[" + target.id + "]");
        const capped = { capped: true, size: 524288, max: 50 };
        try {
            await _db.createCollection(target.id, capped);
            logger.info("DB - collection[" + target.id + "] created");
        } catch (err) {
            logger.error("DB - failed to create collection[" + target.id + "]");
            throw err;
        }
    }
};

const getDB = (collection) => _db.collection(collection);

module.exports = { connect, collection, getDB };
