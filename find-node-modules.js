const path = require('path');

module.exports = findNodeModules;

const PACK_JSON_DEFAULT = path.join(process.cwd(), 'package.json');

function findNodeModules ({ packJSON = PACK_JSON_DEFAULT, dev = false }) {
  const visited = new Set();

  return listDependencies(packJSON);

  function listDependencies (packJSON) {
    const result = Object.keys(readDeps(packJSON, dev))
      .map(resolveModule(packJSON))
      .filter(Boolean)
      .filter(modulePath => !visited.has(modulePath));
    result.forEach(modulePath => visited.add(modulePath));
    return result.concat(...result.map(listDependencies));
  }
};

function readDeps (packJSON, dev) {
  const { dependencies, devDependencies } = require(packJSON);
  return Object.assign(
    {},
    dependencies,
    dev ? devDependencies : {}
  );
}

function resolveModule (packJSON) {
  const packDir = path.dirname(packJSON);
  return (moduleId) => {
    try {
      return require.resolve(
        path.join(moduleId, 'package.json'),
        { paths: [packDir] }
      );
    } catch (ex) {
      // Can not resolve with defaults, so do nothing
    }
  };
}
