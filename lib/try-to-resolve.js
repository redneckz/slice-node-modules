module.exports = tryToResolve;

function tryToResolve (baseDir) {
  return (moduleId) => {
    try {
      const resolvedPath = require.resolve(moduleId, { paths: [baseDir] });
      const isNotBuiltin = resolvedPath !== moduleId; // Builtins have no path, just an ID
      return isNotBuiltin ? resolvedPath : undefined;
    } catch (ex) {
      // Can not resolve with defaults, so do nothing and return undefined
    }
  };
}
