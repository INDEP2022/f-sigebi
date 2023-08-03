import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const EXPEDIENT_COLUMNS = {
  id: {
    title: 'No. Expediente',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación previa',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    sort: false,
  },
  expTransferNumber: {
    title: 'Exp. Transf',
    sort: false,
  },
  insertDate: {
    title: 'Fecha de Registro',
    sort: false,
  },
  authorityNumber: {
    title: 'Autoridad',
    sort: false,
  },
  identifier: {
    title: 'Ident.',
    sort: false,
  },
  crimeKey: {
    title: 'Llave de Crimen',
    sort: false,
  },
  expedientType: {
    title: 'Tipo de Expediente',
    sort: false,
  },
  courtName: {
    title: 'Nombre de Corte',
    sort: false,
  },
  indicatedName: {
    title: 'Indicador',
    sort: false,
  },
  insertedBy: {
    title: 'Ingresado por',
    sort: false,
  },
};
export const COMEMR_BIENES_COLUMNS = {
  goodNumber: {
    title: 'Bien',
    type: 'text',
    sort: false,
  },
  lotDescription: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
  baseValue: {
    title: 'Valor',
    type: 'text',
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
  // file: {
  //   title: 'No. Expediente',
  //   type: 'number',
  //   sort: false,
  //   valuePrepareFuncion: (cell: any, row: any) => {
  //     return row.file.filesId
  //   }
  // },
  approvalUserXAdmon: {
    title: 'Administra',
    type: 'string',
    sort: false,
  },
  numeraryFolio: {
    title: 'Folio Universal',
    type: 'string',
    sort: false,
  },
  numTransfer_: {
    title: 'Transferente',
    type: 'number',
    sort: false,
  },
  dateElaborationReceipt: {
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
};
export const COPY = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  // cell: {
  //   class: (value: any, row: any) => {
  //     if (registrosMovidos.includes(row)) {
  //       return 'registros-movidos';
  //     }
  //     return '';
  //   },
  // },
};

export class IGoodStatus {
  goodClassNumber: string | number;
  goodStatus: string;
  goodId: string | number;
}

export class IConverGoodCreate {
  goodNumber: number | string;
  proceedingNumber: number;
}

export class IDetailProceedingsDeliveryReceptionNew {
  numberProceedings: number;
  numberGood: number | string;
  amount: number;
}
