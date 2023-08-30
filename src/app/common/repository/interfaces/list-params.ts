export class ListParams {
  text?: string = '';
  [others: string]: string | number;
  page?: number = 1;
  inicio?: number = 1;
  limit?: number = 10;
  pageSize?: number = 10;
  take?: number = 10;
  // filter?: string = '';
}

export class FilterBulkTechnical {
  //text?: string = '';
  [others: string]: string | number;
  page?: number = 1;
  inicio?: number = 1;
  limit?: number = 10;
  pageSize?: number = 10;
  //take?: number = 10;
  filter?: string = '';
}

export class FilterParams {
  page?: number = 1;
  limit?: number = 10;
  search?: string = '';
  sortBy?: string = null;
  filters: string[] = [];

  constructor(filter?: FilterParams) {
    if (filter) {
      this.page = filter.page ?? 1;
      this.limit = filter.limit ?? 10;
      this.search = filter.search ?? '';
      //this.sortBy = filter.sortBy ?? '';
      this.filters = filter.filters ?? [];
    }
  }

  addFilter2(filter: string) {
    this.filters.push(filter);
  }

  addFilter3(field: string, value: string) {
    this.filters.push(`${field}=${value}`);
  }

  addFilter(field: string, value: string | number, operator?: SearchFilter) {
    const filter = new DynamicFilter(field, value, operator).getParams();
    this.filters.push(filter);
  }

  getParams() {
    const paginationParams = this.getPaginationParams();
    const allParams = [...this.filters, ...paginationParams];
    // console.log(allParams);
    return allParams.join('&');
  }

  getFilterParams() {
    return this.filters.join('&');
  }

  getFilterByParam(param: string) {
    return this.filters.find(x => x.includes(param));
  }

  removeAllFilters() {
    this.filters = [];
  }

  private getPaginationParams() {
    const paginationParams = [];
    paginationParams.push(`page=${this.page}`);
    paginationParams.push(`limit=${this.limit}`);
    paginationParams.push(`search=${this.search ?? ''}`);
    if (this.sortBy) {
      paginationParams.push(`sortBy=${this.sortBy}`);
    }
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
      if (this.operator == SearchFilter.NULL) {
        return `filter.${this.field}=${SearchFilter.NULL}`;
      } else {
        return `filter.${this.field}=${
          this.operator ? this.operator + ':' : ''
        }${SearchFilter.NULL}`;
      }
    }
    return `filter.${this.field}=${this.operator}:${this.value}`;
  }
}

export enum SearchFilter {
  EQ = '$eq',
  IN = '$in',
  LIKE = '$ilike',
  NOT = '$not',
  NEQ = '$neq',
  NULL = '$null',
  ILIKE = '$ilike',
  GT = '$gt',
  LT = '$lt',
  GTE = '$gte',
  LTE = '$lte',
  BTW = '$btw',
  OR = '$or',
  NOTIN = '$not:$in',
  SD = '$sd',
  LIKE2 = '$like',
}

export interface DynamicFilterLike {
  field: string;
  value?: string | number;
  operator?: SearchFilter;
}
