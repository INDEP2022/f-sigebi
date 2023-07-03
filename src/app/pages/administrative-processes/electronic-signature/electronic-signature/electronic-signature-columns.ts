import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const ELECTRONICSIGNATURE_COLUMNS = {
  armedtradekey: {
    title: 'Clave Oficio Armada',
    width: '20%',
    sort: false,
  },
  rulingdate: {
    title: 'Fecha Dictámen',
    width: '20%',
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
  typeruling: {
    title: 'Tipo Dictámen',
    width: '20%',
    sort: false,
  },
  sender: {
    title: 'Remitente',
    width: '10%',
    sort: false,
  },
  statusof: {
    title: 'Estatus',
    width: '10%',
    sort: false,
  },
  signature: {
    title: 'Firma Electrónica',
    width: '20%',
    sort: false,
  },
};

export const DATA = [
  {
    armedTradeKey: 'CRE/FDER/232/300/3',
    opinionDate: '02/02/2022',
    opinionType: 'Tipo 1',
    sender: 'SAE',
    status: 'Activo',
    electronicSignature: 'SI',
    noRecord: '233',
    noSteeringWheel: '245',
    remitente: 'sigebiadmon',
  },
  {
    armedTradeKey: 'CRE/FDER/232/300/3',
    opinionDate: '02/02/2022',
    opinionType: 'Tipo 1',
    sender: 'SAE',
    status: 'Activo',
    electronicSignature: 'S/FIRMA',
    noRecord: '555',
    noSteeringWheel: '23',
    remitente: 'sigebiadmon',
  },
  {
    armedTradeKey: 'CRE/FDER/232/300/3',
    opinionDate: '02/02/2022',
    opinionType: 'Tipo 2',
    sender: 'SAE',
    status: 'Activo',
    electronicSignature: 'SI',
    noRecord: '666',
    noSteeringWheel: '111',
    remitente: 'sige',
  },
];
