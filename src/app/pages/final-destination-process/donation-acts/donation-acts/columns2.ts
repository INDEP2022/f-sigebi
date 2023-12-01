import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction(call: any, row: any) {
      return row.good.description;
    },
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
};

export const ACTAS = {
  statusProceedings: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  keysProceedings: {
    title: 'Clave Acta',
    type: 'string',
    sort: false,
  },
  idTypeProceedings: {
    title: 'Tipo de Acta',
    type: 'string',
    sort: false,
  },
  elaborationDate: {
    title: 'Fecha de Elaboración',
    type: 'html',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  // file: {
  //   title: 'No. Expediente',
  //   type: 'number',
  //   sort: false,
  //   valuePrepareFuncion: (cell: any, row: any) => {
  //     return row.file.filesId
  //   }
  // },
  // approvedXAdmon: {
  //   title: 'Administra',
  //   type: 'string',
  //   sort: false,
  // },
  universalFolio: {
    title: 'Folio Universal',
    type: 'string',
    sort: false,
  },
  // numTransfer_: {
  //   title: 'Transferente',
  //   type: 'number',
  //   sort: false,
  // },
};

export const EXPEDIENTE = {
  id: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  transferNumber: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  expedientType: {
    title: 'Tipo de Expediente',
    type: 'string',
    sort: false,
  },
};
