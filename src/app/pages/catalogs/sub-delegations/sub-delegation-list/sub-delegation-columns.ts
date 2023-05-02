export const SUB_DELEGATION_COLUMS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Desc',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'No Registro',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  dailyConNumber: {
    title: 'Nro C. diario',
    type: 'number',
    sort: false,
  },
  dateDailyCon: {
    title: 'Fecha',
    type: 'date',
    sort: false,
  },
  phaseEdo: {
    title: 'Etapa EDO',
    type: 'number',
    sort: false,
  },
  registerNumber: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
};
