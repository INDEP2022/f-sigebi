import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMN = {
  'fileNumber.filesId': {
    title: 'Expediente',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.fileNumber.filesId;
    },
  },
  'transferNum.description': {
    title: 'Transferente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.transferNumer.description;
    },
  },
  transferValue: {
    title: 'Valido Gen',
    type: 'number',
    sort: false,
  },
  fileValue: {
    title: 'selección',
    type: 'custom',
    sort: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.fileValue == 'S' ? true : false;
    },
  },
};

export const COLUMNGOOD = {
  'goodNumber.id': {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodNumber.id;
    },
  },
  'goodNumber.description': {
    title: 'Descripción',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodNumber.description;
    },
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  proceedingsValue: {
    title: 'Valor',
    type: 'custom',
    sort: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.proceedingsValue == 'S' ? true : false;
    },
  },
};
