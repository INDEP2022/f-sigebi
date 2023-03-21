export const CITY_COLUMNS = {
  idCity: {
    title: 'No. Ciudad',
    type: 'string',
    sort: false,
  },
  nameCity: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  state: {
    title: 'Entidad Federativa',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.descCondition;
    },
  },
  noDelegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  legendOffice: {
    title: 'Leyenda Oficio',
    type: 'string',
    sort: false,
  },
  noSubDelegation: {
    title: 'Subdelegación',
    type: 'string',
    sort: false,
  },
};
