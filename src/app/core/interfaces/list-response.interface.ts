export interface IListResponse<T> {
  data: T[];
  count: number;
  message: T[];
  statusCode: number;
}
