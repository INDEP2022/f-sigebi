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

// Procede Formalizacion
export const tableSettingsProcedeFormalizacion: any = {
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa
  columns: {
    evento: { title: 'Evento' },
    eventoClave: { title: 'Evento Clave' },
    noBien: { title: 'No. Bien' },
    noBienDetalle: { title: 'No. Bien Detalle' },
    estatusComercial: { title: 'Estatus Comercial' },
    cliente: { title: 'Cliente' },
    incorporado: { title: 'Incorporado' },
    oficioDCBI: { title: 'Oficio DCBI' },
  },
  actions: {
    columnTitle: '',
    add: false,
    edit: true,
    delete: false,
  },
};

export const FORMALIZACION_COLUMNS = {
  eventDad: {
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
  customerId: {
    title: 'Cliente',
    type: 'number',
    sort: false,
  },
  incorporationDate: {
    title: 'Incorporado',
    type: 'string',
    sort: false,
  },
  oficioDCBI: {
    title: 'Oficio DCBI',
    type: 'string',
    sort: false,
  },
};

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
export const dataTableAsignaNotario: any = [
  {
    noBien: 'DATA',
    evento: 'DATA',
    eventoClave: 'DATA',
    incorporado: 'DATA',
    notarioClienteNombre: 'DATA',
    numero: 'DATA',
    ciudad: 'DATA',
    abogado: 'DATA',
    formalizador: 'DATA',
    asignacionFormalizador: 'DATA',
  },
];
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
export const dataTableFormalizaEscrituracion: any = [
  {
    noBien: 'DATA',
    evento: 'DATA',
    eventoClave: 'DATA',
    incorporado: 'DATA',
    escrituraNo: 'DATA',
    fechaEscritura: 'DATA',
    escrituraAnteriorNo: 'DATA',
    noFecha: 'DATA',
  },
];
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

/*
Procede Formalizacion
evento: '',
eventoClave: '',
noBien: '',
noBienDetalle: '',
estatusComercial: '',
cliente: '',
incorporado: '',
oficioDCBI: '',

Asigna Notario
noBien: '',
evento: '',
eventoClave: '',
incorporado: '',
notarioClienteNombre: '',
numero: '',
ciudad: '',
abogado: '',
formalizador: '',
asignacionFormalizador: '',

Formaliza Escrituracion
noBien: '',
evento: '',
eventoClave: '',
incorporado: '',
escrituraNo: ''
fechaEscritura: '',
escrituraAnteriorNo: '',
noFecha: '',

Todos
noBien: '',
noBienDetalle: '',
asignadoNotario: '',
enFormalizacion: '',
escrituracion: '',
desfaseDias: '',
*/
