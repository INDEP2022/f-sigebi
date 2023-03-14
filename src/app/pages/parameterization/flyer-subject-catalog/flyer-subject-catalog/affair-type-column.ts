export const AFFAIR_TYPE_COLUMNS = {
  code: {
    title: 'Código',
    sort: false,
    filter: true,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  referralNoteType: {
    title: 'Tipo de volante',
    sort: false,
    filter: true,
  },
  relationPropertyKey: {
    title: 'Relación con bien',
    sort: false,
    filter: true,
  },
  versionUser: {
    title: 'Permiso Usuario',
    sort: false,
    filter: true,
  },
  idRegister: {
    title: 'Num Registro',
    sort: false,
    filter: true,
  },
};
