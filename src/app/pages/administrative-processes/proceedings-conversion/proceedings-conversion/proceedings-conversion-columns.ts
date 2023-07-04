import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const registrosMovidos: IDetailProceedingsDeliveryReceptionNew[] = [];

export const COPY = {
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
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  cell: {
    class: (value: any, row: any) => {
      if (registrosMovidos.includes(row)) {
        return 'registros-movidos';
      }
      return '';
    },
  },
};

export const GOODSEXPEDIENT_COLUMNS_GOODS = {
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
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  acta: {
    title: 'Acta',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.cveActa;
    },
  },
  status: {
    title: 'Estatus',
    type: 'string',
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
    title: 'Cve Acta',
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
  numTransfer: {
    title: 'Trasnfer',
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
