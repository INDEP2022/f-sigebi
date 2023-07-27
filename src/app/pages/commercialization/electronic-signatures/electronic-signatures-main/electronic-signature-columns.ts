import { DatePipe } from '@angular/common';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const PENDING_COLUMNS = {
  reference: {
    title: 'Referencia',
    type: 'string',
    sort: false,
  },
  document: {
    title: 'Reporte',
    type: 'string',
    sort: false,
  },
  creationdate: {
    title: 'Fecha',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  description: {
    title: 'Descripción Documento',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  denomination: {
    title: 'Tipo Firma',
    type: 'string',
    sort: false,
  },
};

export const HISTORY_COLUMNS = {
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    type: 'string',
    sort: false,
  },
  document: {
    title: 'Documento',
    type: 'string',
    sort: false,
  },
  creationdate: {
    title: 'Fecha',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  firmdate: {
    title: 'Fecha Firma',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  description: {
    title: 'Descripción Documento',
    type: 'string',
    sort: false,
  },
  denomination: {
    title: 'Tipo Firma',
    type: 'string',
    sort: false,
  },
};
