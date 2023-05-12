interface TableSettings {
  selectMode: string;
  actions: any;
  attr: Object;
  pager: Object;
  hideSubHeader: boolean;
  mode: string;
  add: Object;
  edit: Object;
  next: Object;
  delete: Object;
  columns: Object;
  noDataMessage: string;
  selectedRowIndex?: number;
  rowClassFunction?: any;
}

export const TABLE_SETTINGS2: TableSettings = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: false,
    edit: true,
    next: true,
    delete: true,
  },
  attr: {
    class: 'table-bordered',
  },
  pager: {
    display: false,
  },
  hideSubHeader: true,
  mode: 'external',
  add: {},
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
  },
  next: {
    editButtonContent: '<i class="fa fa-arrow-right text-success mx-2"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-arrow-right text-success mx-2"></i>',
  },
  columns: {},
  noDataMessage: 'No se encontrarón registros',
  rowClassFunction: (row: any) => {},
};

export const TABLE_SETTINGS3: TableSettings = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: false,
    edit: true,
    next: true,
    delete: false,
  },
  attr: {
    class: 'table-bordered',
  },
  pager: {
    display: false,
  },
  hideSubHeader: true,
  mode: 'external',
  add: {},
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
  },
  next: {
    editButtonContent: '<i class="fa fa-arrow-right text-success mx-2"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-arrow-right text-success mx-2"></i>',
  },
  columns: {},
  noDataMessage: 'No se encontrarón registros',
  rowClassFunction: (row: any) => {},
};

export const TABLE_SETTINGS4: TableSettings = {
  selectMode: '',
  selectedRowIndex: -1,
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: false,
    edit: false,
    next: false,
    delete: false,
  },
  attr: {
    class: 'table-bordered',
  },
  pager: {
    display: false,
  },
  hideSubHeader: true,
  mode: 'external',
  add: {},
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
  },
  next: {
    editButtonContent: '<i class="fa fa-arrow-right text-success mx-2"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-arrow-right text-success mx-2"></i>',
  },
  columns: {},
  noDataMessage: 'No se encontrarón registros',
  rowClassFunction: (row: any) => {},
};

// Procede Formalizacion
export const dataTableProcedeFormalizacion: any = [
  {
    evento: 'DATA',
    eventoClave: 'DATA',
    noBien: 'DATA',
    noBienDetalle: 'DATA',
    estatusComercial: 'DATA',
    cliente: 'DATA',
    incorporado: 'DATA',
    oficioDCBI: 'DATA',
  },
];
export const FORMALIZACION_COLUMNS = {
  eventId: {
    title: 'ID',
    type: 'number',
    sort: false,
  },
  processKey: {
    title: 'Evento Clave',
    type: 'string',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  description: {
    title: 'No. Bien Detalle',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus Comercial',
    type: 'string',
    sort: false,
  },
  idClient: {
    title: 'Cliente',
    type: 'number',
    sort: false,
  },
  date: {
    title: 'Incorporado',
    type: 'string',
    sort: false,
  },
  jobNumber: {
    title: 'Oficio DCBI',
    type: 'string',
    sort: false,
  },
};

// Asigna Notario
export const tableSettingsAsignaNotario: any = {
  actions: {
    columnTitle: '',
    add: false,
    edit: false,
    delete: false,
  },
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa
  columns: {
    noBien: { title: 'No. Bien' },
    evento: { title: 'Evento' },
    eventoClave: { title: 'Evento Clave' },
    incorporado: { title: 'Incorporado' },
    notarioClienteNombre: { title: ' Nombre del Notario Cliente' },
    numero: { title: 'Nùmero' },
    ciudad: { title: 'Ciudad' },
    abogado: { title: 'Abogado' },
    formalizador: { title: 'Formalizador' },
    asignacionFormalizador: { title: 'Asignación Formalizador' },
  },
};
export const ASIGN_NOTARIES_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  eventId: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
  processKey: {
    title: 'Evento Clave',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Incorporado',
    type: 'string',
    sort: false,
  },
  notaryCli: {
    title: 'Nombre del Notario Cliente',
    type: 'string',
    sort: false,
  },
  numNotaryCli: {
    title: 'Número',
    type: 'number',
    sort: false,
  },
  cityNotary: {
    title: 'Ciudad',
    type: 'string',
    sort: false,
  },
  notaryIdterc: {
    title: 'Abogado',
    type: 'string',
    sort: false,
  },
  formalizador: {
    title: 'Formalizador',
    type: 'string',
    sort: false,
  },
  assignmentnotDate: {
    title: 'Asignación Formalizador',
    type: 'string',
    sort: false,
  },
};

// Formaliza Escrituracion
export const tableSettingsFormalizaEscrituracion: any = {
  actions: {
    columnTitle: '',
    add: false,
    edit: false,
    delete: false,
  },
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa
  columns: {
    noBien: { title: 'No. Bien' },
    evento: { title: 'Evento' },
    eventoClave: { title: 'Evento Clave' },
    incorporado: { title: 'Incorporado' },
    escrituraNo: { title: 'Escritura No.' },
    fechaEscritura: { title: 'Fecha Escritura' },
    escrituraAnteriorNo: { title: 'Escritura Anterior No.' },
    noFecha: { title: 'No. Fecha' },
  },
};
export const ESCRITURACION_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  eventId: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
  processKey: {
    title: 'Evento Clave',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Incorporado',
    type: 'string',
    sort: false,
  },
  writingNumber: {
    title: 'Escritura No.',
    type: 'number',
    sort: false,
  },
  writingDate: {
    title: 'Fecha Escritura',
    type: 'number',
    sort: false,
  },
  writingAntNumber: {
    title: 'Escritura Anterior No.',
    type: 'number',
    sort: false,
  },
  writingAntDate: {
    title: 'No. Fecha',
    type: 'string',
    sort: false,
  },
};

// Todos
export const tableSettingsTodos: any = {
  actions: {
    columnTitle: '',
    add: false,
    edit: false,
    delete: false,
  },
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa
  columns: {
    noBien: { title: 'No. Bien' },
    noBienDetalle: { title: 'No. Bien Detalle' },
    asignadoNotario: { title: 'Asignado Notario' },
    enFormalizacion: { title: 'En Formalización' },
    escrituracion: { title: 'Escrituración' },
    desfaseDias: { title: 'Desfase Días' },
  },
};

export const TODOS_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  description: {
    title: 'No. Bien Detalle',
    type: 'number',
    sort: false,
  },
  notaryCli: {
    title: 'Asignado Notario',
    type: 'string',
    sort: false,
  },
  assignmentnotDate: {
    title: 'En Formalización',
    type: 'string',
    sort: false,
  },
  writingNumber: {
    title: 'Escrituración',
    type: 'string',
    sort: false,
  },
  dias: {
    title: 'Desfase en Días',
    type: 'string',
    sort: false,
  },
};
export const dataTableTodos: any = [
  {
    noBien: 'DATA',
    noBienDetalle: 'DATA',
    asignadoNotario: 'DATA',
    enFormalizacion: 'DATA',
    escrituracion: 'DATA',
    desfaseDias: 'DATA',
  },
];
