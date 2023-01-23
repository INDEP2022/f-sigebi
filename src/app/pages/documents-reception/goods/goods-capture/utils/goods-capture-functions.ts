export function getDeparturesIdsFromFraction(fraction: string) {
  return {
    chapter: fraction.slice(0, 2),
    departure: fraction.slice(2, 4),
    sDeparture: fraction.slice(4, 6),
    ssDeparture: fraction.slice(6, 8),
  };
}
