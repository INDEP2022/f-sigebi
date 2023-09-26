import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const LOAN_DOCUMENT_COLUMNS = {
  noRecord: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  documentType: {
    title: 'Tipo de documento',
    type: 'string',
    sort: false,
  },
  documentDescription: {
    title: 'Descripción del documento',
    type: 'string',
    sort: false,
  },
  devolutionDate: {
    title: 'Fecha de devolución teorica',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  devolutionDateReal: {
    title: 'Fecha de devolución real',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
