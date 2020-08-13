const path = require('path');
const toRelativeModulePath = require('./to-relative-module-path');

describe('toRelativeModulePath', () => {
  it('should strip out file name and return relative to working dir path', () => {
    expect(toRelativeModulePath(path.join('a', 'b', 'c', 'package.json')))
      .toBe(path.join('a', 'b', 'c'));
  });
});
