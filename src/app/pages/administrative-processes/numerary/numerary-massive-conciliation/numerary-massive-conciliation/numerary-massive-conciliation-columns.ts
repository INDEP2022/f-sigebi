import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
// import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';

export let goodCheck: any[] = [];
export let goodCheck2: any[] = [];

export const NUMERARY_MASSIVE_CONCILIATION_COLUMNS = {
  select: {
    title: '',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          console.log(goodCheck);
            goodCheck.push(data.row);
        } else {
          console.log(data.row.RSPTAQUERY)
          goodCheck = goodCheck.filter(
            valor => valor.RSPTAQUERY.no_bien != data.row.RSPTAQUERY.no_bien
          );
        }
      });
    },
  },
  'RSPTAQUERY.no_bien': {
    title: 'Bien',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.no_bien) {
        return row.RSPTAQUERY.no_bien;
      } else {
        return null;
      }
    },
  },
  'RSPTAQUERY.no_expediente': {
    title: 'Expediente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.no_expediente) {
        return row.RSPTAQUERY.no_expediente;
      } else {
        return null;
      }
    },
  },
  'RSPTAQUERY.val4': {
    title: 'Banco',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.val4) {
        return row.RSPTAQUERY.val4;
      } else {
        return null;
      }
    },
  },
  'RSPTAQUERY.val6': {
    title: 'Cuenta Bancaria',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.val6) {
        return row.RSPTAQUERY.val6;
      } else {
        return null;
      }
    },
  },
  'RSPTAQUERY.val1': {
    title: 'Moneda',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.val1) {
        return row.RSPTAQUERY.val1;
      } else {
        return null;
      }
    },
  },
  'RSPTAQUERY.val2': {
    title: 'Depósito',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.val2) {
        return row.RSPTAQUERY.val2;
      } else {
        return null;
      }
    },
  },
  'RSPTAQUERY.val5': {
    title: 'Fec. Depósito',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.RSPTAQUERY && row.RSPTAQUERY.val5) {
        return row.RSPTAQUERY.val5;
      } else {
        return null;
      }
    },
  },
  BFEC_TESOFE: {
    title: 'Fec. Tesofe',
    type: 'string',
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}

export function clearGoodCheck2() {
  goodCheck2 = []
}

export function newGoodCheck(data: any[]){
  goodCheck = data
}

export const NUMERARY_MASSIVE_CONCILIATION_COLUMNS2 = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          console.log(goodCheck);
            goodCheck2.push(data.row);
        } else {
          console.log(data.row.RSPTAQUERY)
          goodCheck = goodCheck2.filter(
            valor => valor.RSPTAQUERY.no_bien != data.row.RSPTAQUERY.no_bien
          );
        }
      });
    },
  },
  goodNumber: {
    title: 'Bien',
    type: 'number',
    sort: false,
  },
  bankKey: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  accountKey: {
    title: 'Cuenta Bancaria',
    type: 'string',
    sort: false,
  },
  currencyKey: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
  deposit: {
    title: 'Depósito',
    type: 'string',
    sort: false,
  },
  motionDate: {
    title: 'Fec. Depósito',
    type: 'string',
    sort: false,
  },
  interestCalculationDate: {
    title: 'Fec. Tesofe',
    type: 'string',
    sort: false,
  },
};
