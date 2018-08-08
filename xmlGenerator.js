const xml = require("xml");
const fs = require("fs");
const base32 = require("hi-base32");
const cheerio = require("cheerio");

const rawDir = "./rawContent/";
const feedDir = "./feed/";

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

const buildFeed = target => {
  const feed = [
    { title: target.feed.title },
    { link: target.feed.link },
    { description: target.feed.description },
    { pubDate: new Date().toGMTString() }
  ];

  target.feed.urls.forEach(url => {
    let $ = cheerio.load(fs.readFileSync(rawDir + base32.encode(url)), {
      decodeEntities: false
    });

    let content = target.content;
    $(content.root)
      .find(content.section) // section
      .each((index, ele) => {
        let title = getText($(ele), content.title); // Title
        let guid = getHref($(ele), content.link); // Guid
        let link = target.feed.link + guid; // Link
        let pubDate = getText($(ele), content.pubDate); // pubDate

        if (title && guid && pubDate) {
          feed.push({
            item: [{ title }, { link }, { guid }, { pubDate }]
          });
        }
      });
  });
  return feed;
};

const generateFeed = targets => {
  targets.forEach(target => {
    const feed = buildFeed(target);
    // let xmlComplete = xml({ rss: summary }, { declaration: true }, true);
    const completeFeed = xml(
      { rss: [{ channel: feed }, { _attr: { version: "2.0" } }] },
      true
    );
    fs.writeFileSync(feedDir + target.feed.title, completeFeed);
  });
};

module.exports = generateFeed;
