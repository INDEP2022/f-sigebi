import { GoodValueEditWebCarCellComponent } from './good-value-edit-web-car-cell/good-value-edit-web-car-cell.component';

export const COLUMNS_GOOD = {
  abreviatura: {
    title: 'Abr.',
    sort: false,
  },
  otvalor: {
    title: 'OTVALOR',
    sort: false,
  },
  info: {
    title: 'INFO',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (cell: number, row: any) => row,
    renderComponent: GoodValueEditWebCarCellComponent,
  },
};
