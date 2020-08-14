const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = parseEntryDeps;

async function parseEntryDeps (entry) {
  const src = await readFile(entry, { encoding: 'utf-8' });
  const statements = src.match(/require\([^)]+\)/g) || [];
  return statements.map(toModuleId);
}

function toModuleId (requireStatement) {
  const [, moduleId] = requireStatement.match(/require\(([^)]+)\)/);
  return moduleId.replace(/['"]/g, '').trim();
}
