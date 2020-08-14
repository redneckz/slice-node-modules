const path = require('path');
const tryToResolve = require('./try-to-resolve');

module.exports = findNodeModules;

function findNodeModules ({ packJSON, dev = false }, visited = new Set()) {
  const modulePackJSONs = Object.keys(readDeps(packJSON, dev))
    .map(resolvePackJSON(packJSON))
    .filter(Boolean)
    .filter(p => !visited.has(p));

  modulePackJSONs.forEach(p => visited.add(p));

  return modulePackJSONs.concat(
    ...modulePackJSONs.map(p => findNodeModules({ packJSON: p, dev }, visited))
  );
}

function readDeps (packJSON, dev) {
  const { dependencies, devDependencies } = require(adjustPath(packJSON));
  return Object.assign(
    {},
    dependencies,
    dev ? devDependencies : {}
  );
}

function resolvePackJSON (basePackJSON) {
  const baseDir = path.dirname(basePackJSON);
  return moduleId => tryToResolve(baseDir)(path.join(moduleId, 'package.json'));
}

function adjustPath (packJSON) {
  return path.isAbsolute(packJSON) ? packJSON : path.join(process.cwd(), packJSON);
}
