export const THIRD_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
    width: '20%',
  },
  nameReason: {
    title: 'Nombre Razón',
    sort: false,
    width: '40%',
  },
  calculationRoutine: {
    title: 'Rutina Cálculo',
    sort: false,
    width: '40%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'COMI_RANGO', title: 'CALCULO X RANGO' },
          { value: 'COMI_TOTAL', title: 'CALCULO_TOTAL' },
          { value: 'COMI_RANGOESP', title: 'CALCULO_RANGO_ESP' },
        ],
      },
    },
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
  // thirdPartyId: {
  //   title: 'ID 3ro Comercializador',
  //   sort: false,
  //   width: '20%'
  // },
  typeEventId: {
    title: 'Tipo de Evento',
    sort: false,
    width: '20%',
  },
  description: {
    title: 'Descripción',
    sort: false,
    width: '80%',
    valuePrepareFunction: (cell: any, row: any) => {
      return row.eventDetail ? row.eventDetail.description : null;
    },
  },
};

export const COMI_XTHIRC_COLUMNS = {
  // idThirdParty: {
  //   title: 'ID 3ro Comercializador',
  //   sort: false,
  //   valuePrepareFunction: (value: any) => {
  //     return value.id;
  //   },
  // },
  // idComiXThird: {
  //   title: 'ID Comer',
  //   sort: false,
  // },
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
