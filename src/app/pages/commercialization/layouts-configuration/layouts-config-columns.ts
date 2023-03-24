import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const LAYOUTS_COLUMNS1 = {
  id: {
    title: 'Id',
    type: 'number',
    sort: true,
  },
  clave: {
    title: 'Clave',
    type: 'string',
    sort: true,
  },
  status: {
    title: 'Status',
    type: 'string',
    sort: true,
  },
  d: {
    title: 'D',
    type: 'string',
    sort: true,
  },
  tipoDispersion: {
    title: 'Tipo Dispersion',
    type: 'string',
    sort: true,
  },
  origen: {
    title: 'Origen',
    type: 'string',
    sort: true,
  },
  fechaCreacion: {
    title: 'Fecha Creacion',
    type: Date,
    sort: true,
  },
  fechaTermino: {
    title: 'Fecha Termino',
    type: Date,
    sort: true,
  },
};

export const LAYOUTS_COLUMNS2 = {
  id: {
    title: 'Id',
    type: 'number',
    sort: true,
  },
  cveProceso: {
    title: 'C.V.E Proceso',
    type: 'string',
    sort: true,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'number',
    sort: true,
  },
  monto: {
    title: 'Monto',
    type: 'number',
    sort: true,
  },
};

export const LAYOUTS_COLUMNS3 = {
  fis: {
    title: 'FIS',
    sort: true,
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
    sort: true,
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
    sort: true,
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
    sort: true,
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
    sort: true,
  },
  claveValida: {
    title: 'Clave Validad',
    sort: true,
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
  // idLayout: {
  //   title: 'Layout',
  //   type: 'number',
  //   sort: true,
  //   valuePrepareFunction: (cell: any, row: any) => {
  //     return row.idLayout.id;
  //   },
  // },
  descLayout: {
    title: 'Descripción',
    type: 'string',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idLayout.descLayout;
    },
  },
  screenKey: {
    title: 'Pantalla',
    type: 'string',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idLayout.screenKey;
    },
  },
  table: {
    title: 'Tabla o Vista',
    type: 'string',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idLayout.table;
    },
  },
  criterion: {
    title: 'Filtro de Selección',
    type: 'string',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idLayout.criterion;
    },
  },
  registryNumber: {
    title: 'Número de registro',
    type: 'number',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idLayout.registryNumber;
    },
  },
  indActive: {
    title: 'Activo',
    sort: true,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    valuePrepareFunction: (cell: any, row: any) => {
      return row.idLayout.indActive;
    },
  },
};

export const LAYOUTS_COLUMNS6 = {
  // idLayout: {
  //   title: 'Layout',
  //   type: 'number',
  //   sort: true,
  //   valuePrepareFunction: (cell: any, row: any) => {
  //     return row.idLayout.id;
  //   },
  // },
  // idConsec: {
  //   title: 'Consec',
  //   type: 'number',
  //   sort: true,
  // },
  position: {
    title: 'Posición',
    type: 'number',
    sort: true,
  },
  column: {
    title: 'Columna',
    type: 'string',
    sort: true,
  },
  type: {
    title: 'Tipo Dato',
    type: 'string',
    sort: true,
  },
  length: {
    title: 'Longitud',
    type: 'number',
    sort: true,
  },
  constant: {
    title: 'Constante',
    type: 'string',
    sort: true,
  },
  carFilling: {
    title: 'Caracter de Relleno',
    type: 'string',
    sort: true,
  },
  justification: {
    title: 'Justificación',
    type: 'string',
    sort: true,
  },
  decimal: {
    title: 'Decimales',
    type: 'string',
    sort: true,
  },
  dateFormat: {
    title: 'Formato de Fecha',
    type: 'string',
    sort: true,
  },
  registryNumber: {
    title: 'Número de Registro',
    type: 'number',
    sort: true,
  },
};

export const LAYOUTS_COLUMNS56 = {
  idLayout: {
    type: 'list',
    // id: {
    //   title: 'Id',
    //   type: 'number',
    //   sort: true,
    //   valuePrepareFunction: (cell: any, row: any) => {
    //     return row.idLayout.id;
    //   },
    // },
    descLayout: {
      title: 'Descripción',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idLayout.descLayout;
      },
    },
    screenKey: {
      title: 'Pantalla',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idLayout.screenKey;
      },
    },
    table: {
      title: 'Tabla o Vista',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idLayout.table;
      },
    },
    criterion: {
      title: 'Filtro de Selección',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idLayout.criterion;
      },
    },
    registryNumber: {
      title: 'Número de registro',
      type: 'number',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idLayout.registryNumber;
      },
    },
    indActive: {
      title: 'Activo',
      sort: true,
      type: 'custom',
      renderComponent: CheckboxElementComponent,
      onComponentInitFunction(instance: any) {
        instance.toggle.subscribe((data: any) => {
          data.row.to = data.toggle;
        });
      },
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idLayout.indActive;
      },
    },
  },

  // idConsec: {
  //   title: 'id Consec',
  //   type: 'number',
  //   sort: true,
  // },
  position: {
    title: 'Posición',
    type: 'number',
    sort: true,
  },
  column: {
    title: 'Columna',
    type: 'string',
    sort: true,
  },
  type: {
    title: 'Tipo Dato',
    type: 'string',
    sort: true,
  },
  length: {
    title: 'Longitud',
    type: 'number',
    sort: true,
  },
  constant: {
    title: 'Constante',
    type: 'string',
    sort: true,
  },
  carFilling: {
    title: 'Caracter de Relleno',
    type: 'string',
    sort: true,
  },
  justification: {
    title: 'Justificación',
    type: 'string',
    sort: true,
  },
  decimal: {
    title: 'Decimales',
    type: 'string',
    sort: true,
  },
  dateFormat: {
    title: 'Formato de Fecha',
    type: 'string',
    sort: true,
  },
  registryNumber: {
    title: 'Número de Registro',
    type: 'number',
    sort: true,
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
