import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  clientId: {
    title: 'No.Cliente',
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.id}` : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.id;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    sort: false,
  },
  typeProcess: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Cve. Evento',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.id} - ${value.processKey}` : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    filter: false,
  },
  lotId: {
    title: 'Lote',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.publicLot} - ${value.description}` : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.publicLot;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    filter: false,
  },
  startDate: {
    title: 'Fecha Inicial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  endDate: {
    title: 'Fecha Final',
    sort: false,
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
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
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};

export const COLUMNS2 = {
  customerId: {
    title: 'No.Cliente',
    sort: false,
  },
  processType: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  event: {
    title: 'Cve. Evento',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.id} - ${value.processKey}` : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    filter: false,
  },
  lot: {
    title: 'Lote',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.id} - ${value.description}` : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    filter: false,
  },
  initialDate: {
    title: 'Fecha Inicial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  finalDate: {
    title: 'Fecha Final',
    sort: false,
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
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
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  releasesDate: {
    title: 'Fecha Libera',
    sort: false,
    type: 'html',
    valuePrepareFunction: (date: any) => {
      if (date != null) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
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
    title: 'Cve. Evento',
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
