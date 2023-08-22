import { format } from "date-fns";

export const REQUESTS_COLUMNS = {
  solnumId: {
    title: 'Id de Solicitud',
    type: 'string',
    sort: false,
  },
  solnumDate: {
    title: 'Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) =>{
        return format(correctDate(cell),'dd/MM/yyyy')
    }
  },
  description: {
    title: 'Concepto',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  user: {
    title: 'Usuario que Solicita',
    type: 'string',
    sort: false,
  },
};

//Correct Date
function correctDate(date: string) {
  const dateUtc = new Date(date);
  return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
}

export const GOODS_COLUMNS = {
  goodNumber: {
    title: 'Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  allInterest: {
    title: 'Intereses',
    type: 'string',
    sort: false,
  },
  allNumerary: {
    title: 'Total',
    type: 'number',
    sort: false,
  },
  commission: {
    title: 'Comisión Bancaria',
    type: 'string',
    sort: false,
  },
  allintPay: {
    title: 'Intereses a Pagar',
    type: 'number',
    sort: false,
  },
  allPayNumber: {
    title: 'Total a Pagar',
    type: 'string',
    sort: false,
  },
};

export const TOTALS_COLUMNS = {
  month: {
    title: 'Mes',
    type: 'number',
    sort: false,
  },
  year: {
    title: 'Año',
    type: 'number',
    sort: false,
  },
  days: {
    title: 'Días',
    type: 'number',
    sort: false,
  },
  amount: {
    title: 'Importe',
    type: 'number',
    sort: false,
  },
  interest: {
    title: 'Interés',
    type: 'number',
    sort: false,
  },
  total: {
    title: 'Total',
    type: 'number',
    sort: false,
  },
};
