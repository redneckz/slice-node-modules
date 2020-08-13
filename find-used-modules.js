const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = findUsedModules;

async function findUsedModules ({ entry }) {
  const src = await readFile(entry, { encoding: 'utf-8' });
  const matchesList = src.match(/require\([^)]+\)/g);

  if (!matchesList) return [];

  const entryDir = path.dirname(entry);

  const modulePaths = matchesList
    .map(toModuleId)
    .map(resolveModule(entryDir))
    .filter(Boolean);

  const [externalModules, modules] = split(isExternalModule)(modulePaths);
  const rest = modules.map(e => findUsedModules({ entry: e }));
  return externalModules.concat(...await Promise.all(rest));
}

function toModuleId (requireStatement) {
  const [, moduleId] = requireStatement.match(/require\(([^)]+)\)/);
  return moduleId.replace(/['"]/g, '').trim();
}

function isExternalModule (modulePath) {
  return modulePath.includes('node_modules');
}

function resolveModule (entryDir) {
  const tryToResolve = (moduleId) => {
    try {
      const resolved = require.resolve(moduleId, { paths: [entryDir] });
      const isBuiltin = resolved === moduleId;
      return !isBuiltin ? resolved : undefined;
    } catch (ex) {
      // Can not resolve with defaults, so do nothing
    }
  };
  return (moduleId) => [
    path.join(moduleId, 'package.json'),
    moduleId
  ].map(tryToResolve).find(Boolean);
}

function split (predicate) {
  return list => [
    list.filter(predicate),
    list.filter(item => !predicate(item))
  ];
}
