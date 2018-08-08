const express = require("express");
const app = express();
import buildFeed from "core";

const port = 12121;
const path = "/feed/";

app.get("/:id", (request, response) => {
  console.log(
    "REQUEST ::: FROM - " + request.params.id + " FOR - " + request.params.id
  );
  response.set("Content-Type", "text/xml");
  response.sendFile(__dirname + path + request.params.id);
});

setInterval(buildFeed(), 3600000);
app.listen(port);
