export function isEmpty(value: string | number) {
  return (
    value == null || (typeof value === 'string' && value.trim().length === 0)
  );
}
