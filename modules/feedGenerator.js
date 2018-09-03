const xml = require("xml");
const reqlib = require("app-root-path").require;
const mongodb = reqlib("/config/dbClient");

const encapsulator = (obj) => {
    const array = [];
    const keys = Object.keys(obj);
    for (key of keys) {
        const newObj = {};
        newObj[key] = obj[key];
        array.push(newObj);
    }

    return array;
};

const getRSS = async (id) => {
    const projection = { projection: { _id: false } };

    const headerDB = await mongodb.getDB("collectionList");
    const header = await headerDB.findOne({ _id: id }, projection);
    const headerXML = encapsulator(header);

    const contentDB = await mongodb.getDB(id);
    const contents = await contentDB.find({}, projection).toArray();
    const contentsXML = contents.map((content) => {
        content.guid = [content.guid, { _attr: { isPermaLink: false } }];
        content.description = { _cdata: content.description };
        return { item: encapsulator(content) };
    });

    const feedContent = headerXML.concat(contentsXML);
    const feed = {
        rss: [{ channel: feedContent }, { _attr: { version: "2.0" } }]
    };

    return xml(feed, true);
};

module.exports = getRSS;
