export const DELEGATION_COLUMNS = {
  id: {
    title: 'No. Delegación',
    sort: false,
  },
  description: {
    title: 'Descripción Delegación',
    sort: false,
  },
};

export const SUBDELEGATION_COLUMNS = {
  delegationNumber: {
    title: 'No. Delegación',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  id: {
    title: 'No. Sub Delegación',
    sort: false,
  },
  description: {
    title: 'Descripción Sub Delegación',
    sort: false,
  },
  // dailyConNumber: {
  //   title: 'No. Consecutivo diario',
  //   sort: false,
  // },
  // dateDailyCon: {
  //   title: 'Fecha consecutiva diaria',
  //   sort: false,
  // },
  // phaseEdo: {
  //   title: 'Etapa Edo',
  //   sort: false,
  // },
  // registerNumber: {
  //   title: 'No. Registro',
  //   sort: false,
  // },
};
