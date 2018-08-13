const spawn = require("child_process").spawn;
const express = require("express");
const app = express();

const parseTarget = require("./targetParser");
const feedGenerator = require("./feedGenerator");

const port = 12121;
const path = "/feed/";

const parseWeb = () => {
  return new Promise(resolve => {
    const pyProg = spawn("python3", ["webScraper.py"]);
    pyProg.stdout.on("data", () => {
      resolve();
    });
  });
};

const startApp = () => {
  parseWeb()
    .then(parseTarget)
    .then(feedGenerator);
};

app.get("/:id", (request, response) => {
  console.log(
    "REQUEST ::: FROM - " + request.params.id + " FOR - " + request.params.id
  );
  response.set("Conthent-Type", "text/xml");
  response.sendFile(__dirname + path + request.params.id);
});

startApp();
setInterval(startApp, 3600000);
app.listen(port);
