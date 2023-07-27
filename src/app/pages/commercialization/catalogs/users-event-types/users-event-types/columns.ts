import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  username: {
    title: 'Usuario',
    sort: false,
  },
  segUsers: {
    title: 'Nombre',
    valuePrepareFunction: (value: any) => {
      return value != null ? value.name : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.name;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    sort: false,
  },
  registrationDate: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
