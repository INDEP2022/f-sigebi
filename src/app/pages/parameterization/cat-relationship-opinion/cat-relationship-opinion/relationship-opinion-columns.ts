export const AFFAIR_TYPE_COLUMNS = {
  code: {
    title: 'Código',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
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
  registryNumber: {
    title: 'No. Registro',
    sort: false,
  },
};
