import { IKey } from 'src/app/core/models/catalogs/date-documents.model';
import { CustomDateFilterComponent } from '../../../../@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const DATEDOCUMENTS_COLUMNS = {
  expedientNumber: {
    title: 'Exp.',
    type: 'number',
    // valuePrepareFunction: (value: IExpedient) => {
    //   return value.id;
    // },
    sort: false,
  },
  stateNumber: {
    title: 'Bien',
    // valuePrepareFunction: (value: IState) => {
    //   return value.id;
    // },
    type: 'number',
    sort: false,
  },
  typeDictum: {
    title: 'Tipo Dicta',
    sort: false,
  },
  key: {
    title: 'Documento',
    valuePrepareFunction: (value: IKey) => {
      return value.key + ' - ' + value.description;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },

    sort: false,
  },
  dateReceipt: {
    title: 'Recibido',
    sort: false,
    type: 'html',
    width: '13%',
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}
      `;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  notificationDate: {
    title: 'Notificación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}
      `;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  userReceipt: {
    title: 'Usuario',
    sort: false,
  },
  insertionDate: {
    title: 'Inserción',
    sort: false,
    type: 'html',
    width: '13%',
    valuePrepareFunction: (text: string) => {
      console.log(text);
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}
      `;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
