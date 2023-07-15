import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
// import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';

export let goodCheck: any[] = []

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
          goodCheck.push(data);
        } else {
          goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
        }
      });
    },
  },
  goodId: {
    title: 'Bien',
    type: 'number',
    sort: false,
  },
  fileNumber: {
    title: 'Expediente',
    type: 'number',
    sort: false,
  },
  val4: {
    title: 'Banco',
    type: 'string',
    sort: false
  },
  val6: {
    title: 'Cuenta Bancaria',
    type: 'string',
    sort: false,
  },
  val1: {
    title: 'Moneda',
    type: 'string',
    sort: false
  },
  val2: {
    title: 'Depósito',
    type: 'string',
    sort: false,
  },
  val5: {
    title: 'Fec. Depósito',
    type: 'string',
    sort: false,
  },
  cveConcept5: {
    title: 'Fec. Tesofe',
    type: 'string',
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
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
