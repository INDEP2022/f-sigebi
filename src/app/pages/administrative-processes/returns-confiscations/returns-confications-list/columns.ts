import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  id: {
    title: 'Bien',
    sort: false,
    editable: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    editable: false,
  },
  extDomProcess: {
    title: 'Ext. Dominio',
    sort: false,
    editable: false,
  },
  scheduledDateDecoDev: {
    title: 'Fecha Decomiso',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    sort: false,
  },
  promoterUserDecoDevo: {
    title: 'Promovente',
    sort: false,
    width: '20%',
    /*editor: {
      type: 'custom',
      component: SelectUserComponent,
    },*/
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    editable: false,
  },
  appraisedValue: {
    title: 'Importe',
    sort: false,
    editable: false,
  },
  tesofeDate: {
    title: 'Fecha Tesofe',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    sort: false,
  },
  /*confRet: {
    title: 'Dev/Conf',
    sort: false,
    editable: false,
  },*/
  tesofeFolio: {
    title: 'Folio Tesofe',
    sort: false,
    editable: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
};
