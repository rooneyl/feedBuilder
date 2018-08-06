const fs = require("fs");
const targetDir = "./target/";

const parse = () => {
  return fs
    .readdirSync(target)
    .filter(fileName => fileName.endWith(".json"))
    .map(fileName => JSON.parse(fs.readFileSync(targetDir + fileName)));
};

export default parse;
