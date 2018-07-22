const rp = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const spawn = require("child_process").spawn;

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
    .replace(/(\r\n|\n|\r)/gm, "");
};

const getHref = $ => {
  return $.find("td>a").attr("href");
};

const feed = {};

fs.readdirSync(targetDir)
  .filter(fileName => fileName.endsWith(".json"))
  .map(fileName => JSON.parse(fs.readFileSync(targetDir + fileName)))
  .forEach(target => {
    let { title, link, url } = target.feed;
    let { root, description, pubDate } = target.content;

    let targetRaw = fs.readFileSync(rawDir + title);
    let $ = cheerio.load(targetRaw.toString(), { decodeEntities: false });
    let tmp = $(root)
      .find("tr") // section
      .each((index, ele) => {
        // console.log("Element : " + index);
        // console.log($(ele).html());

        // Title
        let t = getText($(ele), "td>a>div");

        // Link
        let l = getHref($(ele));

        // pubDate
        let pub = getText($(ele), "td>a>div>small");

        // description

        // console.log(t);
        // console.log(l);
        // console.log(pub);
        feed[index] = { title: t, link: l, pubDate: pub };
        // console.log(feed.index);
      });
    console.log(feed);

    //
    // let pyProg = spawn("python3", [webScraper, title, url[0]]);
    //
    // // TODO : URL => more than one
    // console.log("Processing : " + title + " at " + url[0]);
    // pyProg.stdout.on("data", data => {
    // let targetRaw = fs.readFileSync(rawDir + title);
    // let $ = cheerio.load(targetRaw);
    //
    // console.log(data);
    // console.log("tbody begin");
    // console.log($("tbody",targetRaw));
    //   console.log("tbody end");
    // });
    //
    // pyProg.stderr.on("data", data => {
    //   console.log(data.toString());
    // });
  });
