const express = require("express");
const rp = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const spawn = require("child_process").spawn;
const base32 = require("hi-base32");

const rawDir = "./rawContent/";
const targetDir = "./target/";
const webScraper = "webScraper.py";

const getText = ($, location) => {
  return $
    .find(location)
    .contents()
    .filter((i, e) => e.nodeType === 3)
    .first()
    .text()
    .replace(/(\r\n|\n|\r)/gm, "")
    .trim();
};

const getHref = ($, location) => {
  return $.find(location).attr("href");
};

const parseWeb = (url, index) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Call python helper
      console.log("Start Parsing ::: " + url);
      let pyProg = spawn("python3", [webScraper, url, base32.encode(url)]);

      // TODO: Async handling
      pyProg.stdout.on("data", () => {
        console.log("Parsing Complete ::: " + url);
        resolve();
      });

      pyProg.stderr.on("data", data => {
        console.log("Parsing Failed ::: " + url);
        console.log(data);
        reject();
      });
    }, index * 10000);
  });
};

const createSummary = target => {
  let summary = [];
  let content = target.content;
  target.feed.urls.forEach(url => {
    console.log("Generating FeedBase ::: " + url);
    let $ = cheerio.load(fs.readFileSync(rawDir + base32.encode(url)), {
      decodeEntities: false
    });

    $(content.root)
      .find(content.section) // section
      .each((index, ele) => {
        let title = getText($(ele), content.title); // Title
        let link = getHref($(ele), content.link); // Link
        let pubDate = getText($(ele), content.pubDate); // pubDate

        if (title && link && pubDate) {
          summary.push({ title, link, pubDate });
        }
      });
  });

  return summary;
};

fs.readdirSync(targetDir)
  // Get website list
  .filter(fileName => fileName.endsWith(".json"))
  // Obtain information about each website
  .map(fileName => JSON.parse(fs.readFileSync(targetDir + fileName)))
  // Iternate each websites
  .forEach(target => {
    // setInterval(() => {
    Promise.all(target.feed.urls.map(parseWeb)).then(() => {
      let y = createSummary(target);
      console.log(y);
    });
    // }, target.feed.interval * 1000);
  });

express().listen(8081, function() {});
