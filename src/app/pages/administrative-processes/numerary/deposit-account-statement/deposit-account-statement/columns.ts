import { formatForIsoDate } from 'src/app/shared/utils/date';

export const columnsAccounts = {
  devolutionnumber: {
    title: 'Devolución',
    type: 'string',
    sort: false,
  },
  accountkey: {
    title: 'Cve Cuenta',
    type: 'string',
    sort: false,
  },
  accountnumber: {
    title: 'No. Cuenta',
    type: 'string',
    sort: false,
  },
  accounttras: {
    title: 'Cuenta con Traspaso',
    type: 'string',
    sort: false,
  },
  checkfolio: {
    title: 'Cuenta con Cheque',
    type: 'string',
    sort: false,
  },
  accountnumberorigindeposit: {
    title: 'Cuenta Origen Depósito',
    type: 'string',
    sort: false,
  },
  accountnumberpayreturn: {
    title: 'Cuenta Origen Devolución',
    type: 'string',
    sort: false,
  },
  goodnumber: {
    title: 'Bien',
    type: 'string',
    sort: false,
  },
  expedientnumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  depositnumber: {
    title: 'Importe',
    type: 'string',
    sort: false,
  },
  returnamount: {
    title: 'Importe Cheque',
    type: 'string',
    sort: false,
  },
  bankkey: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  coinkey: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
  interestcalculationdate: {
    title: 'Fecha de transferencia',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      return formatForIsoDate(value, 'string');
    },
  },
  scheduleddatebyconfiscationreturn: {
    title: 'Fecha de corte',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      return formatForIsoDate(value, 'string');
    },
  },
  nameindicated: {
    title: 'Nombre indiciado',
    type: 'string',
    sort: false,
  },
  preliminaryinvestigation: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  criminalcause: {
    title: 'Causa penal',
    type: 'string',
    sort: false,
  },
};

export const columnsAccountsNotCheck = {
  accountkey: {
    title: 'Cve Cuenta',
    type: 'string',
    sort: false,
  },
  accountnumber: {
    title: 'No. Cuenta',
    type: 'string',
    sort: false,
  },
  goodnumber: {
    title: 'Bien',
    type: 'string',
    sort: false,
  },
  expedientnumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  depositnumber: {
    title: 'Importe',
    type: 'string',
    sort: false,
  },
  bankkey: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  coinkey: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
  interestcalculationdate: {
    title: 'Fecha de transferencia',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      return formatForIsoDate(value, 'string');
    },
  },
  scheduleddatebyconfiscationreturn: {
    title: 'Fecha de corte',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      return formatForIsoDate(value, 'string');
    },
  },
  nameindicated: {
    title: 'Nombre indiciado',
    type: 'string',
    sort: false,
  },
  preliminaryinvestigation: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  criminalcause: {
    title: 'Causa penal',
    type: 'string',
    sort: false,
  },
};

export const columnsMovements = {
  numberMotion: {
    title: 'Movimiento',
    type: 'string',
    sort: false,
  },
  deposit: {
    title: 'Importe',
    type: 'string',
    sort: false,
  },
  dateMotion: {
    title: 'Fecha Depósito',
    type: 'string',
    sort: false,
  },
  dateTransfer: {
    title: 'Fecha de Transferencia',
    type: 'string',
    sort: false,
  },
};
