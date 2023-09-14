export interface ColumnDefinition {
  title: string;
  type: string;
  sort: boolean;
  valueGetter?: (rowData: any) => any;
}

export interface ColumnsStatusHistory {
  [key: string]: ColumnDefinition;
}

export const COLUMNS_STATUS_HISTORY: ColumnsStatusHistory = {
  changeDate: {
    title: 'Fecha de Cambio',
    type: 'string',
    sort: false,
  },
  justification: {
    title: 'Justificación',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  usrRegister: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
};
