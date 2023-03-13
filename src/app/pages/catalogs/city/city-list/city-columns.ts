export const CITY_COLUMNS = {
  noRegister: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  nameCity: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  state: {
    title: 'CVE',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.codeCondition;
    },
  },
  noDelegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  noSubDelegation: {
    title: 'Subdelegación',
    type: 'string',
    sort: false,
  },
  legendOffice: {
    title: 'Oficina',
    type: 'string',
    sort: false,
  },
};
