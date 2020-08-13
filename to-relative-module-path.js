const path = require('path');

module.exports = toRelativeModulePath;

function toRelativeModulePath (packJSON) {
  const packDir = path.dirname(packJSON);
  return path.relative(process.cwd(), packDir);
}
