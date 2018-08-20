const express = require("express");
const app = express();

const feedGenerator = require("./feedGenerator");
const mongodb = require("./config/dbClient.js");
const logger = require("./config/logger.js");

const port = 12121;
const path = __dirname + "/feed/";

const startFeedBuilder = async () => {
  // mongodb connection
  try {
    await mongodb.connect();
    logger.info("DB - connection established");
  } catch (err) {
    logger.error("DB - connection failed");
    logger.error(err);
    process.exit(1);
  }

  // server initialization
  app.get("/:id", (request, response) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logger.info("EXP - GET - '" + ip + "' -> " + request.params.id);
    response.set("Content-Type", "text/xml; charset=uft-8");
    response.sendFile(path + request.params.id);
    logger.info("EXP - R - '" + ip + "' -> " + path + request.params.id);
  });

  app.listen(port);
  logger.info("EXP - server is listening " + port);

  // start feed building
  feedGenerator();
};

startFeedBuilder();
