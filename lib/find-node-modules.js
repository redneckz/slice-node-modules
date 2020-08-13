const path = require('path');

module.exports = findNodeModules;

const PACK_JSON_DEFAULT = path.join(process.cwd(), 'package.json');

function findNodeModules ({ packJSON = PACK_JSON_DEFAULT, dev = false }, visited = new Set()) {
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
  const { dependencies, devDependencies } = require(packJSON);
  return Object.assign(
    {},
    dependencies,
    dev ? devDependencies : {}
  );
}

function resolvePackJSON (basePackJSON) {
  const baseDir = path.dirname(basePackJSON);
  return (moduleId) => {
    try {
      return require.resolve(
        path.join(moduleId, 'package.json'),
        { paths: [baseDir] }
      );
    } catch (ex) {
      // Can not resolve with defaults, so do nothing
    }
  };
}
