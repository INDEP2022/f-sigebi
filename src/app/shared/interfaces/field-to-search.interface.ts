import { IComparsionOperator } from './comparsion.interface';

export interface IFieldToSearch {
  field: string;
  name: string;
  type?: string;
  minLength?: number;
  typeSearch: IComparsionOperator[];
  selected?: boolean;
}
