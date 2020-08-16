const isModuleFits = require('./is-module-fits');

describe('isModuleFits', () => {
  it('should allow any module if no filtering options provided', () => {
    expect(isModuleFits({})('foo-1')).toBe(true);
  });

  it('should --include modules by glob pttern (positive)', () => {
    expect(isModuleFits({ include: 'foo*' })('foo-1')).toBe(true);
  });

  it('should --include modules by glob pttern (negative)', () => {
    expect(isModuleFits({ include: 'foo*' })('bar-1')).toBe(false);
  });

  it('should --exclude modules by glob pttern (positive)', () => {
    expect(isModuleFits({ exclude: 'foo*' })('foo-1')).toBe(false);
  });

  it('should --exclude modules by glob pttern (negative)', () => {
    expect(isModuleFits({ exclude: 'foo*' })('bar-1')).toBe(true);
  });
});
