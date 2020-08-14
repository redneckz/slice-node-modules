module.exports = split;

function split (predicate) {
  return list => [
    list.filter(predicate),
    list.filter(item => !predicate(item))
  ];
}
