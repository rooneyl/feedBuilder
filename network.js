const express = require("express");
const app = express();

const port = 12121;
const path = "/feed/";

app.get("/:id", (request, response) => {
  console.log("Receiving get post at " + request.params.id);
  response.set("Content-Type", "text/xml");
  response.sendFile(__dirname + path + request.params.id);

  //TODO : handle unknown ids
});

app.listen(port, () => {
  console.log("FeedBuilder Server Listening on Port ::: " + port);
});
