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
export const COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    type: 'string',
    sort: false,
  },
  expedientNumber: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  officeExternalKey: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },
  cityNumber: {
    title: 'No. Ciudad',
    type: 'string',
    sort: false,
  },
  entFedKey: {
    title: 'No. Entidad Federativa',
    type: 'string',
    sort: false,
  },
  transference: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
  },
  stationNumber: {
    title: 'No. Emisora',
    type: 'string',
    sort: false,
  },
  autorityNumber: {
    title: 'No. Autoridad',
    type: 'string',
    sort: false,
  },
  indiciadoNumber: {
    title: 'No. Indiciado',
    type: 'string',
    sort: false,
  },
  externalOfficeDate: {
    title: 'Fecha Oficio',
    type: 'string',
    sort: false,
  },
  circumstantialRecord: {
    title: 'Acta Circusnt.',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averig. Previa',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  protectionKey: {
    title: 'No. Amparo',
    type: 'string',
    sort: false,
  },
  touchPenaltyKey: {
    title: 'Toca Penal',
    type: 'string',
    sort: false,
  },
  expedientTransferenceNumber: {
    title: 'Exp. Transferente',
    type: 'string',
    sort: false,
  },
};

export const TABLE_SETTINGS_T: TableSettings = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: false,
    edit: false,
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
