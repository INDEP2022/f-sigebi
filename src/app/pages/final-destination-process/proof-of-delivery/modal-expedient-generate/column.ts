import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMN = {
  id: {
    title: 'Expediente',
    type: 'string',
    sort: false,
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
  noGood: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
  Cantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
};
