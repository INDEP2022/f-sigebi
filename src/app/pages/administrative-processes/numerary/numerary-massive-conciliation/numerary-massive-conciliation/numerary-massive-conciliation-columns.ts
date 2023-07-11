// import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
// import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const NUMERARY_MASSIVE_CONCILIATION_COLUMNS = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
  },
  goodId: {
    title: 'Bien',
    type: 'number',
    sort: false,
  },
  withdrawal: {
    title: 'Expediente',
    type: 'number',
    sort: false,
  },
  cveBank: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  numberAccount: {
    title: 'Cuenta Bancaria',
    type: 'string',
    sort: false,
  },
  cveCurrency: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
  deposit: {
    title: 'Depósito',
    type: 'string',
    sort: false,
  },
  cveConcept4: {
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
  goodId: {
    title: 'Bien',
    type: 'number',
    sort: false,
  },
  cveBank: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  numberAccount: {
    title: 'Cuenta Bancaria',
    type: 'string',
    sort: false,
  },
  cveCurrency: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
  deposit: {
    title: 'Depósito',
    type: 'string',
    sort: false,
  },
  cveConcept4: {
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
