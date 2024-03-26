import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const PENDING_COLUMNS = {
  reference: {
    title: 'Referencia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string, data: any) => {
      if (data?.screenkey) {
        return ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(
          data.screenkey
        ) == true
          ? 'Evento ' + data.referenceid
          : data.referenceid;
      } else {
        return `${text}`;
      }
    },
    filterFunction: () => {
      return true;
    },
  },
  document: {
    title: 'Documento',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string, data: any) => {
      if (data?.screenkey) {
        return ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(
          data.screenkey
        ) == true
          ? 'Reporte ' + data.documentid
          : data.documentid;
      } else {
        return `${text}`;
      }
    },
    filterFunction: (text: string, data: any) => {
      return true;
    },
  },
  creationdate: {
    title: 'Fecha',
    // type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(): boolean {
      return true;
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
    filterFunction: () => {
      return true;
    },
  },
  reference: {
    title: 'Referencia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string, data: any) => {
      if (data?.screenkey) {
        return ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(
          data.screenkey
        ) == true
          ? 'Evento ' + data.referenceid
          : data.referenceid;
      } else {
        return `${text}`;
      }
    },
    filterFunction: () => {
      return true;
    },
  },
  document: {
    title: 'Documento',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string, data: any) => {
      if (data?.screenkey) {
        return ['FCOMEREPINGXMAND_I', 'FCOMEREPINGXMAND'].includes(
          data.screenkey
        ) == true
          ? 'Reporte ' + data.documentid
          : data.documentid;
      } else {
        return `${text}`;
      }
    },
    filterFunction: (text: string, data: any) => {
      return true;
    },
  },
  creationdate: {
    title: 'Fecha',
    // type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(): boolean {
      return true;
    },
  },
  firmdate: {
    title: 'Fecha Firma',
    // type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(): boolean {
      return true;
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
