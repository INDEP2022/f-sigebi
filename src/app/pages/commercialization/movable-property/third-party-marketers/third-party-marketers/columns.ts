export const THIRD_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
  },
  nameReason: {
    title: 'nombre Razón',
    sort: false,
  },
  calculationRoutine: {
    title: 'Rutina Cálculo',
    sort: false,
  },
};

export const TYPE_EVENT_THIRD_COLUMNS = {
  thirdPartyId: {
    title: 'ID 3ro comercializador',
    sort: false,
  },
  typeEventId: {
    title: 'Tipo de evento',
    sort: false,
  },
};

export const COMI_XTHIRC_COLUMNS = {
  idThirdParty: {
    title: 'ID 3ro comercializador',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  idComiXThird: {
    title: 'ID comer',
    sort: false,
  },
  startingAmount: {
    title: 'Monto inicial',
    sort: false,
  },
  pctCommission: {
    title: 'Pct comisión',
    sort: false,
  },
  finalAmount: {
    title: 'Monto Final',
    sort: false,
  },
};
