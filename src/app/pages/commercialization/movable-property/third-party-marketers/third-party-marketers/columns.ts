export const THIRD_COLUMNS = {
  id: {
    title: 'Id',
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
  thirdPartyId: {
    title: 'Id. Tercero Comercializador',
    sort: false,
    width: '15%',
  },
  typeEventId: {
    title: 'Tipo de Evento',
    sort: false,
    width: '15%',
  },
  description: {
    title: 'Descripción',
    sort: false,
    width: '70%',
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.eventDetail ? row.eventDetail.description : null;
    // },
  },
};

export const COMI_XTHIRC_COLUMNS = {
  idThirdParty: {
    title: 'Id. Tercero Comercializador',
    sort: false,
    width: '15%',
  },
  // idComiXThird: {
  //   title: 'ID Comer',
  //   sort: false,
  //   width: '15%'
  // },
  startingAmount: {
    title: 'Monto Inicial',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return text ? Number(text).toString() : null;
    },
  },
  pctCommission: {
    title: 'PCT Comisión',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return text ? Number(text).toString() : null;
    },
  },
  finalAmount: {
    title: 'Monto Final',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return text ? Number(text).toString() : null;
    },
  },
};
