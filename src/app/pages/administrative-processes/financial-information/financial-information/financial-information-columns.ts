import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const FINANCIAL_INFORMATION_COLUMNS1 = {
  goodId: {
    title: 'Bien',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idGoodNumber.goodId;
    },
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idGoodNumber.description;
    },
  },
  value: {
    title: 'Valor',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idGoodNumber.quantity;
    },
  },
};

export const FINANCIAL_INFORMATION_COLUMNS2 = {
  idGoodNumber: {
    title: 'Bien',
    type: 'text',
    sort: true,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.idGoodNumber.goodId;
    // },
  },
  description: {
    title: 'Descripción',
    type: 'text',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idGoodNumber.description;
    },
  },
  value: {
    title: '',
    sort: true,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};
