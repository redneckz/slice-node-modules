const fs = require('fs');
const archiver = require('archiver');
const toRelativeModulePath = require('./to-relative-module-path');

module.exports = zip;

function zip (moduleRelativePaths, { packJSON, entry, zip: zipFile }) {
  const archive = archiver('zip');
  archive.on('progress', ({ entries: { total, processed } }) => {
    // TODO Show progress
  });
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.error(err);
    } else {
      throw err;
    }
  });
  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(fs.createWriteStream(zipFile));

  archive.directory(toRelativeModulePath(entry || packJSON));
  moduleRelativePaths.forEach((dir) => {
    archive.directory(dir);
  });

  archive.finalize();
}
