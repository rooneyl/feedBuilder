const xml = require("xml");
const mongodb = require("./config/dbClient");

const encapsulator = obj => {
  const array = [];
  const keys = Object.keys(obj);
  for (key of keys) {
    const newObj = {};
    newObj[key] = obj[key];
    array.push(newObj);
  }

  return array;
};

const getRSS = async id => {
  const query = { title: id };
  const projection = { projection: { _id: false } };
  const feedDB = await mongodb.getDB("collectionList");
  const feedInfo = await feedDB.findOne(query, projection);
  const feedInfoXML = encapsulator(feedInfo);

  const contentDB = await mongodb.getDB(id);
  const contents = await contentDB.find({}, projection).toArray();
  const contentsXML = contents.map(content => {
    return { item: encapsulator(content) };
  });

  const body = feedInfoXML.concat(contentsXML);
  const header = { rss: [{ channel: body }, { _attr: { version: "2.0" } }] };
  return xml(header, true);
};

module.exports = getRSS;
