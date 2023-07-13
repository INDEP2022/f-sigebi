// import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
// import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';

export const RECORDS_ACCOUNT_STATEMENTS_COLUMNS = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementRecordAccountStatementsComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.numberGood !== null;
    },
  },
  dateMotion: {
    title: 'Fecha de Movimiento',
    sort: false,
  },
  deposit: {
    title: 'Abono',
    type: 'number',
    sort: false,
  },
  withdrawal: {
    title: 'Cargo',
    type: 'number',
    sort: false,
  },
  cveConcept: {
    title: 'Concepto',
    type: 'string',
    sort: false,
  },
};

function formatDate(date: string): string {
  return date.replace('-', '/');
}
//2023-04-12
//12/04/2023
