import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const NOTIFICATIONS_FILE_LOAD_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  captureDate: {
    title: 'Fecha de Captura',
    // type: 'string',
    // valuePrepareFunction: (captureDate: Date) => {
    //   return captureDate ? format(new Date(captureDate), 'dd/MM/yyyy') : '';
    // },
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
  receiptDate: {
    title: 'Fecha de Recepción',
    // type: 'string',
    // valuePrepareFunction: (captureDate: Date) => {
    //   return captureDate ? format(new Date(captureDate), 'dd/MM/yyyy') : '';
    // },
    // sort: false,
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
  officeExternalKey: {
    title: 'No. Oficio',
    type: 'number',
    sort: false,
  },
  affairDescription: {
    title: 'Asunto',
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
  observations: {
    title: 'Observaciones',
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
  protectionKey: {
    title: 'Cve. Amparo',
    type: 'string',
    sort: false,
  },
  departmentDescription: {
    title: 'Área Destino',
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
};
