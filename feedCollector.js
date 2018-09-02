const rp = require("request-promise");
const cheerio = require("cheerio");
const logger = require("./config/logger");
const parseTarget = require("./targetParser");
const mongodb = require("./config/dbClient.js");

const parseHtml = async ($, target) => {
    const dedicatedParser = require("./target/" + target.id);
    const item = await dedicatedParser($);

    if (item) {
        const db = mongodb.getDB(target.id);
        const exist = await db.find({ guid: item.guid }).count();

        if (exist == 0) {
            db.insertOne(item);
        }
    }
};

const buildFeed = async (target) => {
    try {
        const html = await rp(target.url);
        const decode = { decodeEntities: false };
        const $ = cheerio.load(html, decode);

        // Divide html dom into each story section
        // the story section is sent to htmlParser
        // htmlParser extract nessary information and store in db
        $(target.root)
            .find(target.section)
            .each((index, ele) => parseHtml($(ele), target));
    } catch (err) {
        logger.error("FEED - error occured while requesting web data");
        logger.error("FEED -       from -> " + target.url);
        logger.error(err);
    }
};

const collectFeed = async () => {
    logger.info("FEED - starting feedGenerator");
    try {
        const targets = parseTarget();
        for (target of targets) {
            logger.info("FEED - processing '" + target.id + "'");
            await mongodb.collection(target);
            buildFeed(target);
        }
    } catch (err) {
        logger.error("FEED - error while running feedGenerator");
        logger.error(err);
    }

    setTimeout(collectFeed, 3600000);
};

module.exports = collectFeed;
