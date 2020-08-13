const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = findUsedModules;

async function findUsedModules ({ entry }, visited = new Set()) {
  const matchesList = await parseEntry(entry);

  const modulePaths = matchesList
    .map(toModuleId)
    .map(resolveModule(entry))
    .filter(Boolean)
    .filter(p => !visited.has(p));

  modulePaths.forEach(p => visited.add(p));

  const [externalModules, entries] = split(isExternalModule)(modulePaths);
  const rest = entries.map(e => findUsedModules({ entry: e }), visited);
  return externalModules.concat(...await Promise.all(rest));
}

async function parseEntry (entry) {
  const src = await readFile(entry, { encoding: 'utf-8' });
  return src.match(/require\([^)]+\)/g) || [];
}

function toModuleId (requireStatement) {
  const [, moduleId] = requireStatement.match(/require\(([^)]+)\)/);
  return moduleId.replace(/['"]/g, '').trim();
}

function isExternalModule (modulePath) {
  return modulePath.includes('node_modules');
}

function resolveModule (entry) {
  const baseDir = path.dirname(entry);
  const tryToResolve = (moduleId) => {
    try {
      const resolved = require.resolve(moduleId, { paths: [baseDir] });
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
