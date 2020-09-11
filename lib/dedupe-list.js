const path = require('path');

module.exports = dedupeList;

function dedupeList (list) {
  const sorted = [...list].sort();
  const seen = {};
  return sorted.filter((item) => {
    const parts = item.split(path.sep);
    let dupe = seen[item];
    while (!dupe && parts.length > 1) {
      if (seen[parts.join(path.sep)]) {
        dupe = true;
      } else {
        parts.pop();
      }
    }
    seen[item] = true;
    return !dupe;
  });
}
