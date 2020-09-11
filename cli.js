#!/usr/bin/env node

const { Readable } = require('stream');
const {
  dedupeList,
  findNodeModules,
  findUsedModules,
  toRelativeModulePath,
  zip
} = require('./lib/index.js');

(async () => {
  try {
    const params = parseArgs(process.argv);

    const handler = params.entry ? handleEntry : handlePackJSON;
    const rawResult = (await handler(params))
      .map(toRelativeModulePath);
    const result = dedupeList(rawResult);
    if (params.zip) zip(result, params);

    const output = formatOutput(result, params);
    Readable.from(output).pipe(process.stdout);
  } catch (ex) {
    console.error(ex.message, ex);
    process.exit(1);
  }
})();

function parseArgs (argv) {
  if (argv.length < 4) invalidArgs();

  const [,, ...opts] = argv;
  const bool = (...keys) => keys.some(k => opts.includes(k));
  const keyVal = (key) => opts.find((o, i) => (opts[i - 1] === key));

  // Required
  const packJSON = keyVal('-p');
  const entry = keyVal('-e');

  if (!packJSON && !entry) invalidArgs();

  return {
    packJSON,
    entry,
    dev: bool('--dev', '-D'),
    print0: bool('--print0', '-0'),
    include: keyVal('--include'),
    exclude: keyVal('--exclude'),
    zip: keyVal('--zip')
  };

  function invalidArgs () {
    console.error('Usage: npx @redneckz/slice-node-modules [-e <source file>] [-p <package.json>] [--dev|-D] [--print0|-0] [--zip <zip file>]');
    process.exit(1);
  }
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

async function * formatOutput (result, { print0 }) {
  const sep = print0 ? String.fromCharCode(0) : '\n';
  for await (const line of result) {
    yield line;
    yield sep;
  }
}
