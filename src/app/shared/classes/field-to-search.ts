import { IComparsionOperator } from '../interfaces/comparsion.interface';
import { IFieldToSearch } from '../interfaces/field-to-search.interface';

export class FieldToSearch implements IFieldToSearch {
  field: string;
  name: string;
  type?: string;
  minLength?: number;
  typeSearch: IComparsionOperator[];
  selected?: boolean = false;

  constructor(_field: IFieldToSearch) {
    const { field, name, type = '', minLength = 0, typeSearch } = _field;
    this.field = field;
    this.name = name;
    this.type = type;
    this.minLength = minLength;
    this.typeSearch = typeSearch;
  }

  toggleSelected() {
    this.selected = !this.selected;
  }
}
