export const CITY_COLUMNS = {
  noRegister: {
    title: 'Registro',
    type: 'number',
  },
  nameCity: {
    title: 'Nombre',
    type: 'string',
  },
  state: {
    title: 'CVE',
    type: 'string',
    valuePrepareFunction: (value: any) => {
      return value.cveState;
    },
  },
  noDelegation: {
    title: 'Delegación',
    type: 'string',
  },
  noSubDelegation: {
    title: 'Subdelegación',
    type: 'string',
  },
  legendOffice: {
    title: 'Oficina',
    type: 'string',
  },
};
