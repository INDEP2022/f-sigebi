export function truncateNDecimals(num: number, positions: number) {
  const s = num.toString();
  const l = s.length;
  const decimalLength = s.indexOf('.') + 1;
  const numStr = s.slice(0, decimalLength + positions);
  return Number(numStr);
}
