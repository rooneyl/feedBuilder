const xml = require("xml");
const fs = require("fs");
const base32 = require("hi-base32");
const cheerio = require("cheerio");

const rawDir = "./rawContent/";
const feedDir = "./feed/";

const getText = $ => {
  return $
    .contents()
    .filter((i, e) => e.nodeType === 3)
    .first()
    .text()
    .replace(/(\r\n|\n|\r)/gm, "")
    .trim();
};

const getHref = $ => {
  return $.attr("href");
};

const selectorParser = ($, selector) => {
  const splitSelector = selector.split(">").map(x => x.trim());
  for (sel of splitSelector) {
    if ($) {
      if (sel.includes(":")) {
        const index = sel.split(":");
        $ = $.find(index[0]).eq(parseInt(index[1]));
      } else {
        $ = $.find(sel);
      }
    }
  }
  return $;
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
        let title = selectorParser($(ele), content.title);
        if (title) title = getText(title);

        let guid = selectorParser($(ele), content.link);
        if (guid) guid = getHref(guid);

        let pubDate = selectorParser($(ele), content.pubDate);
        if (pubDate) pubDate = getText(pubDate);

        let link = target.feed.link + guid; // Link

        if (title && guid) {
          console.log("title: " + title);
          console.log("guid : " + guid);
          console.log("pub  : " + pubDate);
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
    const completeFeed = xml(
      { rss: [{ channel: feed }, { _attr: { version: "2.0" } }] },
      true
    );
    fs.writeFileSync(feedDir + target.feed.title, completeFeed);
  });
};

module.exports = generateFeed;
