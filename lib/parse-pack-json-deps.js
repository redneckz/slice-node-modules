const path = require('path');

module.exports = parsePackJSONDeps;

function parsePackJSONDeps (packJSON, dev) {
  const { dependencies, devDependencies } = require(adjustPath(packJSON));
  return Object.assign(
    {},
    dependencies,
    dev ? devDependencies : {}
  );
}

function adjustPath (packJSON) {
  return path.isAbsolute(packJSON)
    ? packJSON
    : path.join(process.cwd(), packJSON);
}
