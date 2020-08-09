#!/usr/bin/env node

const { Readable } = require('stream');
const { EOL } = require('os');
const { findNodeModules } = require('./index.js');

(async () => {
  try {
    const params = parseArgs(process.argv);
    const foundModules = findNodeModules(params);
    Readable.from(formatOutput(foundModules, params))
      .pipe(process.stdout);
  } catch (ex) {
    console.error(ex.message, ex);
    process.exit(1);
  }
})();

function parseArgs (argv) {
  if (argv.length < 3) throw new Error('Usage: slice-node-modules <dest> [--dev|-D]');

  const [,, dest, ...opts] = argv;
  const dev = opts.includes('--dev') || opts.includes('-D');
  const print0 = opts.includes('--print0') || opts.includes('-0');
  return { dest, dev, print0 };
}

async function * formatOutput (foundModules, { print0 }) {
  const sep = print0 ? String.fromCharCode(0) : EOL;
  for await (const m of foundModules) {
    yield m;
    yield sep;
  }
}
