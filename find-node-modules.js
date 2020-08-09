const path = require('path');

module.exports = findNodeModules;

function findNodeModules ({ dev = false }) {
  const visited = new Set();

  return listDependencies(path.join(process.cwd(), 'package.json'))
    .map(moduleJSON => path.dirname(moduleJSON))
    .map(modulePath => path.relative(process.cwd(), modulePath));

  function listDependencies (packJSON) {
    const result = Object.keys(readDeps(packJSON, dev))
      .map(resolveModule)
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

function resolveModule (id) {
  try {
    return require.resolve(
      path.join(id, 'package.json'),
      { paths: [process.cwd()] }
    );
  } catch (ex) {
    // Can not resolve with defaults, so do nothing
  }
}
