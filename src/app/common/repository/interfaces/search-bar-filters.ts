import { SearchFilter } from './list-params';
export interface SearchBarFilter {
  field: string;
  value?: string | number;
  operator?: SearchFilter;
}
