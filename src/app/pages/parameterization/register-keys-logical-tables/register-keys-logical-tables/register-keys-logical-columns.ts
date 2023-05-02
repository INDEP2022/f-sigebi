export const LOGICAL_TABLE = {
  name: {
    title: 'Nombre',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  tableType: {
    title: 'Tipo de tabla',
    sort: false,
  },
};

export const REGISTER_KEYS_LOGICAL_COLUMNS1 = {
  dsKey1: {
    title: 'Descripción',
    sort: false,
    width: '25%',
  },
  swFormat1: {
    title: 'Formato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
    width: '25%',
  },
  longMin1: {
    title: 'Lonngitud mínima',
    sort: false,
    width: '25%',
  },
  longMax1: {
    title: 'Longitud Máxima',
    sort: false,
    width: '25%',
  },
};

export const REGISTER_KEYS_LOGICAL_COLUMNS2 = {
  dsKey2: {
    title: 'Descripción',
    sort: false,
    width: '25%',
  },
  swFormat2: {
    title: 'Formato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
    width: '25%',
  },
  longMin2: {
    title: 'Lonngitud mínima',
    sort: false,
    width: '25%',
  },
  longMax2: {
    title: 'Longitud Máxima',
    sort: false,
    width: '25%',
  },
};

export const REGISTER_KEYS_LOGICAL_COLUMNS3 = {
  dsKey3: {
    title: 'Descripción',
    sort: false,
    width: '25%',
  },
  swFormat3: {
    title: 'Formato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
    width: '25%',
  },
  longMin3: {
    title: 'Lonngitud mínima',
    sort: false,
    width: '25%',
  },
  longMax3: {
    title: 'Longitud Máxima',
    sort: false,
    width: '25%',
  },
};

export const REGISTER_KEYS_LOGICAL_COLUMNS4 = {
  dsKey4: {
    title: 'Descripción',
    sort: false,
    width: '25%',
  },
  swFormat4: {
    title: 'Formato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
    width: '25%',
  },
  longMin4: {
    title: 'Lonngitud mínima',
    sort: false,
    width: '25%',
  },
  longMax4: {
    title: 'Longitud Máxima',
    sort: false,
    width: '25%',
  },
};

export const REGISTER_KEYS_LOGICAL_COLUMNS5 = {
  dsKey5: {
    title: 'Descripción',
    sort: false,
    width: '25%',
  },
  swFormat5: {
    title: 'Formato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
    width: '25%',
  },
  longMin5: {
    title: 'Lonngitud mínima',
    sort: false,
    width: '25%',
  },
  longMax5: {
    title: 'Longitud Máxima',
    sort: false,
    width: '25%',
  },
};
