export function offlinePagination<T = any>(
  array: T[],
  limit: number,
  page: number
) {
  return array.slice((page - 1) * limit, page * limit);
}
