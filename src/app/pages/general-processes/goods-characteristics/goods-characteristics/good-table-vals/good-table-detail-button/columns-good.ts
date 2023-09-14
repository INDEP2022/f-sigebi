import { GoodValueEditWebCarCellComponent } from './good-value-edit-web-car-cell/good-value-edit-web-car-cell.component';

export const COLUMNS_GOOD = {
  abreviatura: {
    title: 'ABREVIATURA',
    sort: false,
  },
  otvalor: {
    title: 'VALOR',
    sort: false,
  },
  info: {
    title: 'INFORMACIÓN',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (cell: number, row: any) => row,
    renderComponent: GoodValueEditWebCarCellComponent,
  },
};
