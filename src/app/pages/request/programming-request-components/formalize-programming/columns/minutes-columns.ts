import { InputCellComponent } from 'src/app/@standalone/smart-table/input-cell/input-cell.component';

export const MINUTES_COLUMNS = {
  idMinute: {
    title: 'id acta',
    type: 'number',
    sort: false,
  },

  statusMinute: {
    title: 'Estatus acta',
    type: 'string',
    sort: false,
  },
  observation: {
    title: 'Observación',
    sort: false,
    type: 'custom',
    showAlways: true,
    renderComponent: InputCellComponent,
  },
};
