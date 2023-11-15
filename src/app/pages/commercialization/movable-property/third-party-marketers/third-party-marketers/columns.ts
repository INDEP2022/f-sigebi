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
    type: 'html',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  pctCommission: {
    title: 'PCT Comisión',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  finalAmount: {
    title: 'Monto Final',
    type: 'html',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
};
