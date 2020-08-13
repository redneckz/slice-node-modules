#!/usr/bin/env node

const { Readable } = require('stream');
const { EOL } = require('os');
const { findNodeModules, findUsedModules, toRelativeModulePath } = require('./lib/index.js');

(async () => {
  try {
    const params = parseArgs(process.argv);

    const handler = params.entry ? handleEntry : handlePackJSON;
    const foundModules = await handler(params);

    const output = formatOutput(foundModules, params);
    Readable.from(output).pipe(process.stdout);
  } catch (ex) {
    console.error(ex.message, ex);
    process.exit(1);
  }
})();

function parseArgs (argv) {
  if (argv.length < 4) throw new Error('Usage: npx @redneckz/slice-node-modules [-e <source file>] [-p <package.json>] [--dev|-D] [--print0|-0]');

  const [,, ...opts] = argv;
  const packJSON = opts.find((o, i) => (opts[i - 1] === '-p'));
  const entry = opts.find((o, i) => (opts[i - 1] === '-e'));
  const dev = opts.includes('--dev') || opts.includes('-D');
  const print0 = opts.includes('--print0') || opts.includes('-0');
  return { packJSON, entry, dev, print0 };
}

async function handleEntry (params) {
  const usedModules = await findUsedModules(params);
  return usedModules.concat(
    ...usedModules.map(packJSON => findNodeModules({ ...params, packJSON }))
  );
}

async function handlePackJSON (params) {
  return findNodeModules(params);
}

async function * formatOutput (foundModules, { print0 }) {
  const sep = print0 ? String.fromCharCode(0) : EOL;
  for await (const line of foundModules.map(toRelativeModulePath)) {
    yield line;
    yield sep;
  }
}
