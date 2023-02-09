export const EMAIL_COLUMNS = {
  // cveScreen: {
  //   title: 'cve Pantalla',
  //   sort: false,
  // },

  id: {
    title: 'Usuario',
    sort: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
  },
  usuario: {
    title: 'Delegación',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.delegationNumber;
    },
  },
  email: {
    title: 'Email',
    sort: false,
  },
  registryNumber: {
    title: 'No. registro',
    sort: false,
  },
  // typeD: {
  //   title: 'Tipo de destino',
  //   sort: false,
  // },
};
