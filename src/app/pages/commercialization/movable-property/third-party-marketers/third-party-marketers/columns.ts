export const THIRD_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
  },
  nameReason: {
    title: 'Nombre Razón',
    sort: false,
  },
  calculationRoutine: {
    title: 'Rutina Cálculo',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.calculationRoutine == 'COMI_RANGO') {
        return 'CALCULO X RANGO';
      } else if (row.calculationRoutine == 'COMI_RANGOESP') {
        return 'CALCULO_RANGO_ESP';
      } else {
        return 'CALCULO_TOTAL';
      }
    },
  },
};

export const TYPE_EVENT_THIRD_COLUMNS = {
  thirdPartyId: {
    title: 'ID 3ro Comercializador',
    sort: false,
  },
  typeEventId: {
    title: 'Tipo de Evento',
    sort: false,
  },
};

export const COMI_XTHIRC_COLUMNS = {
  idThirdParty: {
    title: 'ID 3ro Comercializador',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  idComiXThird: {
    title: 'ID Comer',
    sort: false,
  },
  startingAmount: {
    title: 'Monto Inicial',
    sort: false,
  },
  pctCommission: {
    title: 'Pct Comisión',
    sort: false,
  },
  finalAmount: {
    title: 'Monto Final',
    sort: false,
  },
};
