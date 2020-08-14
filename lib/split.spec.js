const split = require('./split');

describe('split', () => {
  it('should split array by predicate', () => {
    const isEven = n => (n % 2 === 0);
    expect(split(isEven)([1, 2, 3, 4])).toEqual([[2, 4], [1, 3]]);
  });

  it('should return pair of empty arrays if empty array provided', () => {
    expect(split(Boolean)([])).toEqual([[], []]);
  });
});
