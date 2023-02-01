export function getDeparturesIdsFromFraction(fraction: string) {
  let _fraction = fraction;
  if (fraction.length == 7) {
    _fraction = `0${fraction}`;
  }
  return {
    chapter: _fraction.slice(0, 2),
    departure: _fraction.slice(2, 4),
    sDeparture: _fraction.slice(4, 6),
    ssDeparture: _fraction.slice(6, 8),
  };
}
