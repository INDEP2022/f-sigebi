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
      return row.cveConcept;
    },
  },
};

//2001-12-18
//18/12/2001

// function formatDate(date: string): string {
//   return date.replace('-', '/');
// }

// // import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
// // import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
// import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';
// import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';

// export const RECORDS_ACCOUNT_STATEMENTS_COLUMNS = {
//   turnSelect: {
//     title: 'Selección',
//     sort: false,
//     showAlways: true,
//     filter: false,
//     editable: false,
//     type: 'custom',
//     renderComponent: CheckboxElementRecordAccountStatementsComponent,
//     valuePrepareFunction: (cell: any, row: any) => {
//       return row.numberGood !== null;
//     },
//   },
//   dateMotion: {
//     title: 'Fecha de Movimiento',
//     sort: false,
//     // filter: {
//     //   type: 'custom',
//     //   component: CustomDateDayFilterComponent,
//     // },
//     // valuePrepareFunction: (date: string) => formatDate(date),
//   },
//   deposit: {
//     title: 'Abono',
//     type: 'number',
//     sort: false,
//   },
//   withdrawal: {
//     title: 'Cargo',
//     type: 'number',
//     sort: false,
//   },
//   cveConcept: {
//     title: 'Concepto',
//     type: 'string',
//     sort: false,
//   },
// };

// function formatDate(date: string): string {
//   return date.replace('-', '/');
// }
// //2023-04-12
// //2002-09-30
// //12/04/2023

// // import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
// // import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
// import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';
// import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';

// export const RECORDS_ACCOUNT_STATEMENTS_COLUMNS = {
//   turnSelect: {
//     title: 'Selección',
//     sort: false,
//     showAlways: true,
//     filter: false,
//     editable: false,
//     type: 'custom',
//     renderComponent: CheckboxElementRecordAccountStatementsComponent,
//     valuePrepareFunction: (cell: any, row: any) => {
//       return row.numberGood !== null;
//     },
//   },
//   dateMotion: {
//     title: 'Fecha de Movimiento',
//     sort: false,
//     valuePrepareFunction: (cell: any, row: any) => {
//       const parts = cell.split('-');
//       const year = parts[0];
//       const month = parts[1];
//       const day = parts[2];

//       const formattedDate = `${day}/${month}/${year}`;
//       return formattedDate;
//     },
//     filter: {
//       type: 'custom',
//       component: CustomDateDayFilterComponent,
//     },
//   },
//   deposit: {
//     title: 'Abono',
//     type: 'number',
//     sort: false,
//   },
//   passDiverse: {
//     title: 'Cargo',
//     type: 'number',
//     sort: false,
//   },
//   cveConcept: {
//     title: 'Concepto',
//     type: 'string',
//     sort: false,
//   },
// };

// //2001-12-18
// //18/12/2001

// // function formatDate(date: string): string {
// //   return date.replace('-', '/');
// // }

// // // import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
// // // import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
// // import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';
// // import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';

// // export const RECORDS_ACCOUNT_STATEMENTS_COLUMNS = {
// //   turnSelect: {
// //     title: 'Selección',
// //     sort: false,
// //     showAlways: true,
// //     filter: false,
// //     editable: false,
// //     type: 'custom',
// //     renderComponent: CheckboxElementRecordAccountStatementsComponent,
// //     valuePrepareFunction: (cell: any, row: any) => {
// //       return row.numberGood !== null;
// //     },
// //   },
// //   dateMotion: {
// //     title: 'Fecha de Movimiento',
// //     sort: false,
// //     // filter: {
// //     //   type: 'custom',
// //     //   component: CustomDateDayFilterComponent,
// //     // },
// //     // valuePrepareFunction: (date: string) => formatDate(date),
// //   },
// //   deposit: {
// //     title: 'Abono',
// //     type: 'number',
// //     sort: false,
// //   },
// //   withdrawal: {
// //     title: 'Cargo',
// //     type: 'number',
// //     sort: false,
// //   },
// //   cveConcept: {
// //     title: 'Concepto',
// //     type: 'string',
// //     sort: false,
// //   },
// // };

// // function formatDate(date: string): string {
// //   return date.replace('-', '/');
// // }
// // //2023-04-12
// // //2002-09-30
// // //12/04/2023
