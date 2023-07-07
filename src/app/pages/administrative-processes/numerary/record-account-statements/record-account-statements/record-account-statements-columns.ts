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
    // filter: {
    //   type: 'custom',
    //   component: CustomDateDayFilterComponent,
    // },
    // valuePrepareFunction: (date: string) => formatDate(date),
    valuePrepareFunction: (cell: any, row: any) => {
      const date = new Date(cell);
      const day = ('0' + date.getDate()).slice(-2); // Agregar cero inicial si el día tiene un solo dígito
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Agregar cero inicial si el mes tiene un solo dígito
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
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

// function formatDate(date: string): string {
//   return date.replace('-', '/');
// }
