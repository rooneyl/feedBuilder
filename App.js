const express = require("express");
const app = express();

const feedCollector = require("./modules/feedCollector");
const mongodb = require("./config/dbClient.js");
const logger = require("./config/logger.js");
const getRSS = require("./modules/feedGenerator.js");

const port = 12121;

const startFeedBuilder = async () => {
    // mongodb connection
    try {
        await mongodb.connect();
        logger.info("DB - Successfully established connection with Mongodb");
    } catch (err) {
        logger.error("DB - Failed to establish connection with Mongodb");
        logger.error(err);
        process.exit(1);
    }

    // server initialization
    app.get("/:id", (req, res) => {
        const ip =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        logger.info("EXP - GET - '" + ip + "' -> " + req.params.id);
        res.set("Content-Type", "text/xml; charset=uft-8");
        getRSS(req.params.id)
            .then((rss) => {
                res.send(rss);
            })
            .catch(() => {
                res.sendStatus(404);
            });
    });

    app.listen(port);
    logger.info("EXP - server is listening " + port);

    // start feed building
    feedCollector();
};

startFeedBuilder();
