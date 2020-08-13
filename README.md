# slice-node-modules

List only needed modules to package before going to production (packaging of AWS Lambda, for example)

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

## Installation

```shell
npm install --save-dev @redneckz/slice-node-modules
```

or

```shell
npx @redneckz/slice-node-modules [-e <source file>] [-p <package.json>] [--dev|-D] [--print0|-0]
```

## How-to

To list all packages used by `some-package`:

```shell
$ npx @redneckz/slice-node-modules -e some-package/lib/index.js
```

or

```shell
$ npx @redneckz/slice-node-modules -p some-package/package.json
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
