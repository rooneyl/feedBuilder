const fs = require("fs");
const targetDir = "./target/";

const parse = () => {
  return fs
    .readdirSync(targetDir)
    .filter(fileName => fileName.endsWith(".json"))
    .map(fileName => JSON.parse(fs.readFileSync(targetDir + fileName)));
};

module.exports = parse;
