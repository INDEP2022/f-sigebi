const type: any[] = [
  { value: 'A', title: 'Administrativo' },
  { value: 'P', title: 'Procesal' },
  { value: 'T', title: 'Transferente' },
  { value: 'AT', title: 'AdminTransferente' },
];

const relation: any[] = [
  { value: 'S', title: 'SI' },
  { value: 'N', title: 'NO' },
];

const user: any[] = [
  { value: 'S', title: 'SI' },
  { value: 'N', title: 'NO' },
];

export const FLYER_SUBJECT_CAT_COLUMNS2 = {
  code: {
    title: 'Código',
    sort: false,
    filter: false,
  },
  referralNoteType: {
    title: 'Tipo de volante',
    sort: false,
    filter: false,
    editor: {
      type: 'list',
      config: {
        list: type,
      },
    },
  },
  relationPropertyKey: {
    title: 'Relación con bien',
    sort: false,
    filter: false,
    editor: {
      type: 'list',
      config: {
        list: relation,
      },
    },
  },
  versionUser: {
    title: 'Permiso Usuario',
    sort: false,
    filter: false,
    editor: {
      type: 'list',
      config: {
        list: user,
      },
    },
  },
  idRegister: {
    title: 'Num Registro',
    sort: false,
    filter: false,
  },
};
