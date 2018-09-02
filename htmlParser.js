const rp = require("request-promise");
const cheerio = require("cheerio");
const mongodb = require("./config/dbClient.js");

const getText = ($) => {
    return $.contents()
        .filter((i, e) => e.nodeType === 3)
        .first()
        .text()
        .replace(/(\r\n|\n|\r)/gm, "")
        .trim();
};

const getHref = ($) => {
    return $.attr("href");
};

const selectorParser = ($, selector) => {
    const splitSelector = selector.split(">").map((x) => x.trim());
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

const parseHtml = async ($, target) => {
    const content = target.content;
    let title = selectorParser($, content.title);
    if (title) title = getText(title);

    let guid = selectorParser($, content.link);
    if (guid) guid = getHref(guid);

    let pubDate;
    if (content.pubDate) {
        pubDate = selectorParser($, content.pubDate);
    } else {
        pubDate = new Date().toGMTString();
    }

    let link = target.feed.link + guid; // Link

    if (title && guid && pubDate) {
        // console.log("title: " + title);
        // console.log("guid : " + guid);
        // console.log("link : " + link);
        // console.log("pub  : " + pubDate);

        const db = mongodb.getDB(target.feed.title);
        const exist = await db.find({ guid }).count();
        if (exist == 0) {
            const desHtml = await rp(link);
            const decode = { decodeEntities: false };
            const $ = cheerio.load(desHtml, decode);
            const description = $(content.description)
                .text()
                .replace(/(\n)/gm, "");

            // console.log(description);
            db.insertOne({ title, guid, pubDate, description });
        }
    }
};

module.exports = parseHtml;
