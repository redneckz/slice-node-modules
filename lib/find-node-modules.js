const path = require('path');
const parsePackJSONDeps = require('./parse-pack-json-deps');
const isModuleFits = require('./is-module-fits');
const tryToResolve = require('./try-to-resolve');

module.exports = findNodeModules;

function findNodeModules (params, visited = new Set()) {
  const { packJSON, dev = false } = params;

  const modulePackJSONs = Object.keys(parsePackJSONDeps(packJSON, dev))
    .filter(isModuleFits(params))
    .map(resolvePackJSON(packJSON))
    .filter(Boolean)
    .filter(p => !visited.has(p));

  modulePackJSONs.forEach(p => visited.add(p));

  return modulePackJSONs.concat(
    ...modulePackJSONs.map(p => findNodeModules({ packJSON: p, dev }, visited))
  );
}

function resolvePackJSON (basePackJSON) {
  const baseDir = path.dirname(basePackJSON);
  return moduleId => tryToResolve(baseDir)(path.join(moduleId, 'package.json'));
}
