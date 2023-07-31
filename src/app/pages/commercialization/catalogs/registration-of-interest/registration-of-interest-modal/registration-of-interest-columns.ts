import { DatePipe } from '@angular/common';
import { FilterDatePickerComponent } from '../filter-date-picker/filter-date-picker.component';

export const COUNT_TIIE_COLUMNS = {
  // id: {
  //   title: 'Id',
  //   type: 'number',
  //   sort: false,
  // },
  tiieDays: {
    title: 'Días TIIE',
    type: 'number',
    sort: true,
    valuePrepareFunction: (dias: number) => {
      var formatted = Math.trunc(dias);
      return formatted;
    },
  },
  tiieAverage: {
    title: 'Promedio TIIE',
    type: 'number',
    sort: true,
    valuePrepareFunction: (avg: number) => {
      var formatted = Math.trunc(avg);
      return formatted;
    },
  },
  tiieMonth: {
    title: 'Mes TIIE',
    type: 'number',
    sort: true,
  },
  tiieYear: {
    title: 'Año TIIE',
    type: 'number',
    sort: true,
  },
  user: {
    title: 'Usuario',
    type: 'text',
    sort: true,
  },
  registryDate: {
    title: 'Fecha de Registro',
    type: 'string',
    sort: true,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let value = new DatePipe('en-EN').transform(cell, 'dd/MM/yyyy', 'UTC');
      var formatted = new DatePipe('en-EN').transform(
        search,
        'dd/MM/yyyy',
        'UTC'
      );
      console.log('filtro');
      console.log(value);
      console.log(formatted);
      return formatted.indexOf(formatted) >= 0;
    },
    filter: {
      type: 'custom',
      component: FilterDatePickerComponent,
    },
  },
};
