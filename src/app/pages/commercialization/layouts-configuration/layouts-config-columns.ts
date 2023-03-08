import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const LAYOUTS_COLUMNS1 = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  clave: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Status',
    type: 'string',
    sort: false,
  },
  d: {
    title: 'D',
    type: 'string',
    sort: false,
  },
  tipoDispersion: {
    title: 'Tipo Dispersion',
    type: 'string',
    sort: false,
  },
  origen: {
    title: 'Origen',
    type: 'string',
    sort: false,
  },
  fechaCreacion: {
    title: 'Fecha Creacion',
    type: Date,
    sort: false,
  },
  fechaTermino: {
    title: 'Fecha Termino',
    type: Date,
    sort: false,
  },
};

export const LAYOUTS_COLUMNS2 = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  cveProceso: {
    title: 'C.V.E Proceso',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  monto: {
    title: 'Monto',
    type: 'number',
    sort: false,
  },
};

export const LAYOUTS_COLUMNS3 = {
  fis: {
    title: 'FIS',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  cnt: {
    title: 'CNT',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  pto: {
    title: 'PTO',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  TSR: {
    title: 'TSR',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};

export const LAYOUTS_COLUMNS4 = {
  fechaTransf: {
    title: 'Fecha Transferencia',
    type: Date,
    sort: false,
  },
  claveValida: {
    title: 'Clave Validad',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};

export const LAYOUTS_COLUMNS5 = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  descLayout: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  screenKey: {
    title: 'Pantalla',
    type: 'string',
    sort: false,
  },
  table: {
    title: 'Tabla o Vista',
    type: 'string',
    sort: false,
  },
  criterion: {
    title: 'Filtro de Selección',
    type: 'string',
    sort: false,
  },
  registryNumber: {
    title: 'Número de registro',
    type: 'number',
    sort: false,
  },
  indActive: {
    title: 'Activo',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};

export const LAYOUTS_COLUMNS6 = {
  idLayout: {
    title: 'Layout',
    type: 'number',
    sort: false,
  },
  idConsec: {
    title: 'id',
    type: 'number',
    sort: false,
  },
  position: {
    title: 'Posición',
    type: 'number',
    sort: false,
  },
  column: {
    title: 'Columna',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo Dato',
    type: 'string',
    sort: false,
  },
  length: {
    title: 'Longitud',
    type: 'number',
    sort: false,
  },
  constant: {
    title: 'Constante',
    type: 'string',
    sort: false,
  },
  carFilling: {
    title: 'Caracter de Relleno',
    type: 'string',
    sort: false,
  },
  justification: {
    title: 'Justificación',
    type: 'string',
    sort: false,
  },
  decimal: {
    title: 'Decimales',
    type: 'string',
    sort: false,
  },
  dateFormat: {
    title: 'Formato de Fecha',
    type: 'string',
    sort: true,
  },
  registryNumber: {
    title: 'Número de Registro',
    type: 'number',
    sort: false,
  },
};

export const LAYOUTS_COLUMNS56 = {
  idLayout: {
    title: 'idLayout',
    type: 'number',
    sort: false,
  },
  idConsec: {
    title: 'id Consec',
    type: 'number',
    sort: false,
  },
  position: {
    title: 'Posición',
    type: 'number',
    sort: false,
  },
  column: {
    title: 'Columna',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo Dato',
    type: 'string',
    sort: false,
  },
  length: {
    title: 'Longitud',
    type: 'number',
    sort: false,
  },
  constant: {
    title: 'Constante',
    type: 'string',
    sort: false,
  },
  carFilling: {
    title: 'Caracter de Relleno',
    type: 'string',
    sort: false,
  },
  justification: {
    title: 'Justificación',
    type: 'string',
    sort: false,
  },
  decimal: {
    title: 'Decimales',
    type: 'string',
    sort: false,
  },
  dateFormat: {
    title: 'Formato de Fecha',
    type: 'string',
    sort: true,
  },
  registryNumber: {
    title: 'Número de Registro',
    type: 'number',
    sort: false,
  },
};

export const EXAMPLE_DATA = [
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
];

export const EXAMPLE_DAT2 = [
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
];

export const EXAMPLE_DAT3 = [{}, {}, {}, {}];

export const EXAMPLE_DAT4 = [
  {
    fechaTransf: new Date(),
  },
  {
    fechaTransf: new Date(),
  },
  {
    fechaTransf: new Date(),
  },
  {
    fechaTransf: new Date(),
  },
];

export const EXAMPLE_DAT5 = [
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
];

export const EXAMPLE_DAT6 = [
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
];
