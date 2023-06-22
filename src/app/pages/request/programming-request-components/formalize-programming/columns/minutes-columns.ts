import { InputCellComponent } from 'src/app/@standalone/smart-table/input-cell/input-cell.component';

export const MINUTES_COLUMNS = {
  id: {
    title: 'id acta',
    type: 'number',
    sort: false,
  },

  statusProceeedings: {
    title: 'Estatus acta',
    type: 'string',
    sort: false,
  },
  observationProceedings: {
    title: 'Observación',
    sort: false,
    type: 'custom',
    showAlways: true,
    renderComponent: InputCellComponent,
  },
};
