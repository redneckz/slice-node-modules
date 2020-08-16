const path = require('path');
const parseEntryDeps = require('./parse-entry-deps');
const tryToResolve = require('./try-to-resolve');
const isModuleFits = require('./is-module-fits');
const split = require('./split');

module.exports = findUsedModules;

async function findUsedModules (params, visited = new Set()) {
  const { entry } = params;
  const moduleIds = await parseEntryDeps(entry);

  const modulePaths = moduleIds
    .filter(isModuleFits(params))
    .map(resolveModule(entry))
    .filter(Boolean)
    .filter(p => !visited.has(p));

  modulePaths.forEach(p => visited.add(p));

  const [externalModules, entries] = split(isExternalModule)(modulePaths);
  const rest = entries.map(e => findUsedModules({ ...params, entry: e }), visited);
  return externalModules.concat(...await Promise.all(rest));
}

function isExternalModule (modulePath) {
  return modulePath.includes('node_modules');
}

function resolveModule (entry) {
  const baseDir = path.dirname(entry);
  return (moduleId) => [
    path.join(moduleId, 'package.json'), // Try to resolve as external module
    moduleId // Try to resolve as source file
  ].map(tryToResolve(baseDir)).find(Boolean);
}
