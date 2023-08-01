import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const NOTIFICATIONS_COLUMNS = {
  expedientNumber: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  versionUser: {
    title: 'Nombre Indiciado',
    type: 'string',
    sort: false,
  },
  receiptDate: {
    title: 'Fecha Recepción',
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
  protectionKey: {
    title: 'Amparo',
    type: 'string',
    sort: false,
  },
  touchPenaltyKey: {
    title: 'Toca Penal ',
    type: 'string',
    sort: false,
  },
  courtNumber: {
    title: 'No. Juzgado ',
    type: 'string',
    sort: false,
  },
  externalOfficeDate: {
    title: 'Fecha Oficio Externo',
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
  minpubNumber: {
    title: 'Ministerio Público',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      console.log(value);
      return value ? value.descripcion : '';
    },
  },
  institutionNumber: {
    title: 'Oficio Externo No.',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  entFedKey: {
    title: 'Entidad Federativa',
    type: 'string',
    sort: false,
  },
};

/* 
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
*/
export const GOODS_COLUMNS = {
  typeDescription: {
    title: 'Tipo',
    type: 'number',
    sort: false,
  },
  subTypeDescription: {
    title: 'Subtipo',
    type: 'number',
    sort: false,
  },
  ssubTypeDescription: {
    title: 'Ssubtipo',
    type: 'number',
    sort: false,
  },
  sssubTypeDescription: {
    title: 'Sssubtipo',
    type: 'number',
    sort: false,
  },
  fileNumber: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  subDelegationNumber: {
    title: 'Subdelegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
};
