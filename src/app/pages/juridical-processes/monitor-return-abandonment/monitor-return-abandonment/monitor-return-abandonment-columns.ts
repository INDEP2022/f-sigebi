interface TableSettings {
  selectMode: string;
  actions: any;
  attr: Object;
  pager: Object;
  hideSubHeader: boolean;
  mode: string;
  add: Object;
  edit: Object;
  delete: Object;
  columns: Object;
  noDataMessage: string;
  selectedRowIndex?: number;
  rowClassFunction?: any;
}

export const TABLE_SETTINGS_T: TableSettings = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: true,
    edit: true,
    delete: false,
  },
  attr: {
    class: 'table-bordered',
  },
  pager: {
    display: false,
  },
  hideSubHeader: false,
  mode: 'external',
  add: {},
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-3"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-trash text-danger mx-2"></i>',
    confirmDelete: true,
  },
  columns: {},
  noDataMessage: 'No se encontrarón registros',
  rowClassFunction: (row: any) => {},
};

export const MONITOR_RETUR_ABANDONMENT = {
  id: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  leaveCause: {
    title: 'Motivo Abandono',
    type: 'string',
    sort: false,
  },
  complianceLeaveDate: {
    title: 'Fecha Última Notificación',
    type: 'string',
    sort: false,
  },
  notifyDate: {
    title: 'Fecha Notificación',
    type: 'string',
    sort: false,
  },
  leaveObservations: {
    title: 'Observaciones Abandono',
    type: 'string',
    sort: false,
  },
  judicialLeaveDate: {
    title: 'Fecha Ratificación Judicial',
    type: 'string',
    sort: false,
  },
};
