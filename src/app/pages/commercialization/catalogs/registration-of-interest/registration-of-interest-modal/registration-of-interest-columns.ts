import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COUNT_TIIE_COLUMNS = {
  /*id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },*/
  tiieDays: {
    title: 'Día TIIE',
    type: 'number',
    sort: false,
    valuePrepareFunction: (dias: number) => {
      var formatted = Math.trunc(dias);
      return formatted;
    },
  },
  tiieAverage: {
    title: 'Promedio TIIE',
    type: 'number',
    sort: false,
    valuePrepareFunction: (avg: number) => {
      var formatted = Math.trunc(avg);
      return formatted;
    },
  },
  tiieMonth: {
    title: 'Mes TIIE',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-soft-info">Enero</span></strong>';
      if (value == '2')
        return '<strong><span class="badge badge-pill badge-soft-info" >Febrero</span></strong>';
      if (value == '3')
        return '<strong><span class="badge badge-pill badge-soft-info">Marzo</span></strong>';
      if (value == '4')
        return '<strong><span class="badge badge-pill badge-soft-info">Abril</span></strong>';
      if (value == '5')
        return '<strong><span class="badge badge-pill badge-soft-info">Mayo</span></strong>';
      if (value == '6')
        return '<strong><span class="badge badge-pill badge-soft-info">Junio</span></strong>';
      if (value == '7')
        return '<strong><span class="badge badge-pill badge-soft-info">Julio</span></strong>';
      if (value == '8')
        return '<strong><span class="badge badge-pill badge-soft-info">Agosto</span></strong>';
      if (value == '9')
        return '<strong><span class="badge badge-pill badge-soft-info">Septiembre</span></strong>';
      if (value == '10')
        return '<strong><span class="badge badge-pill badge-soft-info">Octubre</span></strong>';
      if (value == '11')
        return '<strong><span class="badge badge-pill badge-soft-info">Noviembre</span></strong>';
      if (value == '12')
        return '<strong><span class="badge badge-pill badge-soft-info">Diciembre</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'Enero' },
          { value: '2', title: 'Febrero' },
          { value: '3', title: 'Marzo' },
          { value: '4', title: 'Abril' },
          { value: '5', title: 'Mayo' },
          { value: '6', title: 'Junio' },
          { value: '7', title: 'Julio' },
          { value: '8', title: 'Agosto' },
          { value: '9', title: 'Septiembre' },
          { value: '10', title: 'Octubre' },
          { value: '11', title: 'Noviembre' },
          { value: '12', title: 'Diciembre' },
        ],
      },
    },
  },
  tiieYear: {
    title: 'Año TIIE',
    type: 'number',
    sort: false,
  },
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  registryDate: {
    title: 'Fecha de Registro',
    type: 'html',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    /*filterFunction(cell?: any, search?: string): boolean {
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
    },*/
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
