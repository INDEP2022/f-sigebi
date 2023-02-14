export class ListParams {
  text?: string = '';
  [others: string]: string | number;
  page?: number = 1;
  inicio?: number = 1;
  limit?: number = 10;
  pageSize?: number = 10;
  take?: number = 10;
  //filter?: string = '';
}

export class FilterParams {
  page?: number = 1;
  limit?: number = 10;

  private filters: string[] = [];

  addFilter(field: string, value: string | number, operator?: SearchFilter) {
    const filter = new DynamicFilter(field, value, operator).getParams();
    this.filters.push(filter);
  }

  getParams() {
    const paginationParams = this.getPaginationParams();
    const allParams = [...paginationParams, ...this.filters];
    return allParams.join('&');
  }

  removeAllFilters() {
    this.filters = [];
  }

  private getPaginationParams() {
    const paginationParams = [];
    paginationParams.push(`page=${this.page}`);
    paginationParams.push(`limit=${this.limit}`);
    return paginationParams;
  }
}

class DynamicFilter {
  constructor(
    public field: string,
    public value: string | number,
    public operator: SearchFilter = SearchFilter.EQ
  ) {}

  getParams() {
    if (this.value == SearchFilter.NULL) {
      return `filter.${this.field}=${SearchFilter.NULL}`;
    }
    return `filter.${this.field}=${this.operator}:${this.value}`;
  }
}

export enum SearchFilter {
  EQ = '$eq',
  IN = '$in',
  LIKE = '$ilike',
  NOT = '$not',
  NULL = '$null',
}
