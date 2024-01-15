import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const proceedingsColumns = {
  proceedingKey: {
    title: 'Programación de entrega',
    type: 'string',
    sort: false,
  },
  elaborated: {
    title: 'Elaboro',
    type: 'string',
    sort: false,
  },
};

export const requestColumns = {
  'doneeId.id': {
    title: 'Id',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.doneeId.id;
    },
  },
  donee: {
    title: 'Donatario',
    type: 'string',
    sort: false,
  },
  'requestId.id': {
    title: 'Solicitud',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.requestId.id;
    },
  },
  sunQuantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};

export const goodsColumns = {
  goodId: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};

export const sGoodsColumns = {
  'goodId.goodNumber': {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodId.goodNumber;
    },
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
  solAmount: {
    title: 'Saldo\nCantidad',
    type: 'string',
    sort: false,
  },
  uniMedGood: {
    title: 'Cantidad\nUnidad de medida',
    type: 'string',
    sort: false,
    editor: {
      type: 'checkbox',
    },
  },
  packageEt: {
    title: 'Paquete',
    type: 'custom',
    sort: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.packageEt == 'S' ? true : false;
    },
  },
};
