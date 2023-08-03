import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  typeProcess: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Clave Evento',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      
    },*/
    /*valuePrepareFunction: (value: any) => {
      return value != null ? value.id : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },*/
    /*filterFunction(cell?: any, search?: string): boolean {
      console.log(cell.id);
      let column123 = cell.id;
      if (column123?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },*/

    /*filterFunction(cell?: any, search?: string): boolean {
      let column = cell.id;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },*/
  },
  publicLot: {
    title: 'Lote',
    sort: false,
  },
  startDate: {
    title: 'Fecha Inicial',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  endDate: {
    title: 'Fecha Final',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  refeOfficeOther: {
    title: 'Referencia/Oficio/Otros',
    sort: false,
  },
  userPenalty: {
    title: 'Usuario Penaliza',
    sort: false,
  },
  penaltiDate: {
    title: 'Fecha Penaliza',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
  },
};

export const COLUMNS2 = {
  processType: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Clave Evento',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.id : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      console.log(cell.id);
      let column123 = cell.id;
      if (column123?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  batchPublic: {
    title: 'Lote',
    sort: false,
  },
  initialDate: {
    title: 'Fecha Inicial',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
  },
  finalDate: {
    title: 'Fecha Final',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  referenceJobOther: {
    title: 'Motivo Penalización',
    sort: false,
  },
  causefree: {
    title: 'Motivo Liberación',
    sort: false,
  },
  usrPenalize: {
    title: 'Usuario Penaliza',
    sort: false,
  },
  usrfree: {
    title: 'Usuario Libera',
    sort: false,
  },
  penalizesDate: {
    title: 'Fecha Penaliza',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  releasesDate: {
    title: 'Fecha Libera',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};

export const COLUMNS3 = {
  processType: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Clave Evento',
    sort: false,
  },
  batchPublic: {
    title: 'Lote',
    sort: false,
  },
  referenceJobOther: {
    title: 'Motivo Penalización',
    sort: false,
  },
  causefree: {
    title: 'Motivo Liberación',
    sort: false,
  },
  usrPenalize: {
    title: 'Usuario Penaliza',
    sort: false,
  },
  usrfree: {
    title: 'Usuario Libera',
    sort: false,
  },
};
