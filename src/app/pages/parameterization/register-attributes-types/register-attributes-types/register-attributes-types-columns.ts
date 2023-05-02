export const REGISTER_ATT_TYPES_COLUMNS = {
  /*classifGoodNumber: {
    title: 'No. Clasificación Bien',
    sort: false,
  },*/
  columnNumber: {
    title: 'Clave',
    sort: false,
  },
  attribute: {
    title: 'Atributo',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  dataType: {
    title: 'Tipo de dato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
  },
  tableCd: {
    title: 'Tabla de soporte',
    sort: false,
  },
  required: {
    title: 'Requerido',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'NO ';
      if (value == 'S') return 'SI';

      return value;
    },
  },
  length: {
    title: 'Largo',
    sort: false,
  },
  update: {
    title: 'Actualización',
    sort: false,
  },
  accessKey: {
    title: 'Clave acceso',
    sort: false,
  },
  typeAct: {
    title: 'Tipo de Acta',
    sort: false,
  },
  registrationNumber: {
    title: 'No. Registro',
    sort: false,
  },
};
