const rp = require("request-promise");
const cheerio = require("cheerio");
const logger = require("./config/logger");
const parseHtml = require("./htmlParser");
const parseTarget = require("./targetParser");
const mongodb = require("./config/dbClient.js");

const buildFeed = async target => {
  for (url of target.feed.urls) {
    try {
      logger.info("FEED - requesting -> " + url);
      const html = await rp(url);
      logger.info("FEED - requesting '" + url + "'" + "success");
      const decode = { decodeEntities: false };
      const $ = cheerio.load(html, decode);

      // Divide html dom into each story section
      // the story section is sent to htmlParser
      // htmlParser extract nessary information and store in db
      logger.info("FEED - redirecting '" + url + "' to htmlParse");
      $(target.content.root)
        .find(target.content.section)
        .each((index, ele) => parseHtml($(ele), target));
    } catch (err) {
      logger.error("FEED - error occured while requesting web data");
      logger.error("FEED -       from -> " + url);
      logger.error(err);
    }
  }
};

const generateFeed = async () => {
  logger.info("FEED - starting feedGenerator");
  try {
    const targets = parseTarget();
    for (target of targets) {
      logger.info("FEED - processing '" + target.feed.title + "'");
      await mongodb.collection(target);
      buildFeed(target);
    }
  } catch (err) {
    logger.error("FEED - error while running feedGenerator");
    throw err;
  }
};

module.exports = generateFeed;
