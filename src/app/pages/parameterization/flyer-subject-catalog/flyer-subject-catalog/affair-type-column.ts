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
