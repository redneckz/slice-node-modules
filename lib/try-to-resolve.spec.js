const path = require('path');

const tryToResolve = require('./try-to-resolve');

describe('tryToResolve', () => {
  it('should return undefined on builtin modules', () => {
    expect(tryToResolve('.')('fs')).toBe(undefined);
  });

  it('should return full path for local sources', () => {
    expect.assertions(2);
    const modulePath = tryToResolve('.')('./try-to-resolve');
    expect(modulePath).toMatch(/try-to-resolve\.js$/);
    expect(path.isAbsolute(modulePath)).toBe(true);
  });
});
