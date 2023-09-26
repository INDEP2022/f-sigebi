// import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
// import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';
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
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  deposit: {
    title: 'Abono',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  passDiverse: {
    title: 'Cargo',
    type: 'number',
    sort: false,
  },
  cveConcept: {
    title: 'Concepto',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.cveConcept?.cveConcept;
    },
  },
};
