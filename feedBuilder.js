const spawn = require("child_process").spawn;
const parseWeb = () => {
  return new Promise(resolve => {
    const pyProg = spawn("python3", ["webScraper.py"]);
    pyProg.stdout.on("data", () => {
      resolve();
    });
  });
};

const parseTarget = require("./targetParser");
const feedGenerator = require("./xmlGenerator");

parseWeb()
  .then(parseTarget)
  .then(feedGenerator);

const express = require("express");
const app = express();

const port = 12121;
const path = "/feed/";

app.get("/:id", (request, response) => {
  console.log(
    "REQUEST ::: FROM - " + request.params.id + " FOR - " + request.params.id
  );
  response.set("Content-Type", "text/xml");
  response.sendFile(__dirname + path + request.params.id);
});

// setInterval(buildFeed(), 3600000);
app.listen(port);
