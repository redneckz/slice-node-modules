# slice-node-modules

List only needed modules to package/archive/zip before going to production (packaging of AWS Lambda, for example)

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

## Installation

```shell
npm install --save-dev @redneckz/slice-node-modules
```

Using npx:
```shell
npx @redneckz/slice-node-modules [-e <source file>] [-p <package.json>] [--dev|-D] [--print0|-0]
```

## How-to

List all packages used by `some-package`:
```shell
$ # Parse dependencies from source files (-e stands for entry file)
$ npx @redneckz/slice-node-modules -e some-package/lib/index.js
$ # or from package.json
$ npx @redneckz/slice-node-modules -p some-package/package.json
```

Dev. dependencies:
```shell
$ npx @redneckz/slice-node-modules -e some-package/lib/index.js --dev
```

Filtering options --include/--exclude:
```shell
$ npx @redneckz/slice-node-modules -e some-package/lib/index.js --exclude 'aws-*'
```

Zero-separated (for `xargs`, for example):
```shell
$ npx @redneckz/slice-node-modules -e some-package/lib/index.js --print0
```

## AWS Lambda Packaging

In case of monorepo (just for example):
```shell
$ npx @redneckz/slice-node-modules -e monorepo-root/packages/some-lambda/lib/index.js \
  | zip -r some-lambda.zip monorepo-root/packages/some-lambda/lib/ -@
```
AWS Lambda config (CloudFormation):
```ts
const logLambda = new Function(this, 'some-lambda', {
  code: new AssetCode('some-lambda.zip'),
  handler: 'monorepo-root/packages/some-lambda/lib/index.handler',
  runtime: Runtime.NODEJS_12_X
});
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Fslice-node-modules.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Fslice-node-modules
[travis-image]: https://travis-ci.org/redneckz/slice-node-modules.svg?branch=master
[travis-url]: https://travis-ci.org/redneckz/slice-node-modules
[coveralls-image]: https://coveralls.io/repos/github/redneckz/slice-node-modules/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/slice-node-modules?branch=master
[bundlephobia-image]: https://badgen.net/bundlephobia/min/@redneckz/slice-node-modules
[bundlephobia-url]: https://bundlephobia.com/result?p=@redneckz/slice-node-modules
