const minimatch = require('minimatch');

module.exports = isModuleFits;

function isModuleFits ({ include, exclude }) {
  return moduleId => (!include || minimatch(moduleId, include)) &&
    (!exclude || !minimatch(moduleId, exclude));
}
