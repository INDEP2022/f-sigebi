import { IListResponse } from "src/app/core/interfaces/list-response";

export class DefaultSelect<T> implements IListResponse<T> {
  constructor(public data: any[] = [], public count: number = 0) {}
}