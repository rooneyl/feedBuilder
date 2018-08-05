const xml = require("xml");

export default (generateXml = (target, summary) => {
  summary.unshift(
    { title: target.feed.title },
    { link: target.feed.link },
    { description: target.feed.description },
    { pubDate: new Date().toGMTString() }
  );

  // let xmlComplete = xml({ rss: summary }, { declaration: true }, true);
  let xmlComplete = xml(
    { rss: [{ channel: summary }, { _attr: { version: "2.0" } }] },
    true
  );
  console.log(xmlComplete);
});
