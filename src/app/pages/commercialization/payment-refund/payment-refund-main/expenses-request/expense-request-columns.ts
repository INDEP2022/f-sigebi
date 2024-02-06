export const PAYMENT_REQUEST_COLUMNS = {
  beneficiary: {
    title: 'Beneficiario',
    type: 'number',
    sort: false,
    width: '15%',
  },
  name: {
    title: 'Denominación',
    type: 'string',
    sort: false,
    width: '20%',
  },
  amount: {
    title: 'Monto',
    type: 'html',
    sort: false,
    width: '10%',
    valuePrepareFunction: (val: string) => {
      const formatter = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        minimumFractionDigits: 2,
      });

      return formatter.format(Number(val));
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  commentary: {
    title: 'Servicio',
    type: 'string',
    width: '25%',
    sort: false,
  },
  documentation: {
    title: 'Documentación Anexa',
    type: 'string',
    width: '30%',
    sort: false,
  },
};
