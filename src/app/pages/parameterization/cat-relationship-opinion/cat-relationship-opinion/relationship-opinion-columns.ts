export const AFFAIR_COLUMNS = {
  id: {
    title: 'Código',
    sort: false,
    width: '35px',
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  processDetonate: {
    title: 'Proceso detona',
    sort: false,
  },
};

export const AFFAIR_TYPE_COLUMNS = {
  code: {
    title: 'Código',
    sort: false,
    filter: false,
  },
  referralNoteType: {
    title: 'Tipo de volante',
    sort: false,
    filter: false,
  },
  relationPropertyKey: {
    title: 'Relación con bien',
    sort: false,
    filter: false,
  },
  versionUser: {
    title: 'Permiso Usuario',
    sort: false,
    filter: false,
  },
  idRegister: {
    title: 'Num Registro',
    sort: false,
    filter: false,
  },
};

export const DICTA_COLUMNS = {
  code: {
    title: 'Código',
    sort: false,
  },
  dictum: {
    title: 'Dictámen',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  flyerType: {
    title: 'Tipo volante',
    sort: false,
  },
  doc: {
    title: 'Doc',
    sort: false,
  },
  property: {
    title: 'Bien',
    sort: false,
  },
  g_of: {
    title: 'g_of',
    sort: false,
  },
  i: {
    title: 'i',
    sort: false,
  },
  e: {
    title: 'e',
    sort: false,
  },
};
