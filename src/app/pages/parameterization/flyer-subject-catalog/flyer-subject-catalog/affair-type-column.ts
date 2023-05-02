export const AFFAIR_TYPE_COLUMNS = {
  // code: {
  //   title: 'Código',
  //   sort: false,

  //   valuePrepareFunction: (value: any) => {
  //     return value.id;
  //   },
  // },
  referralNoteType: {
    title: 'Tipo de volante',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'P') return 'Procesal';
      if (value == 'T') return 'Transferente';
      if (value == 'A') return 'Administrativo';
      if (value == 'AT') return 'AdminTransferente';

      return value;
    },
  },
  relationPropertyKey: {
    title: 'Relación con bien',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';

      return value;
    },
  },
  versionUser: {
    title: 'Permiso Usuario',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';

      return value;
    },
  },
};
