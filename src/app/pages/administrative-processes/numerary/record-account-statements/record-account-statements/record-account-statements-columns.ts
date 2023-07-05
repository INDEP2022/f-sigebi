// import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
import { CheckboxElementRecordAccountStatementsComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-record-account-statements';
// import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const RECORDS_ACCOUNT_STATEMENTS_COLUMNS = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementRecordAccountStatementsComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.turnSelect = data.toggle;
      });
    },
    valuePrepareFunction: (cell: any, row: any) => {
      // Evalúa si el valor de "numberGood" es diferente de null
      return row.numberGood !== null;
    },
  },
  dateMotion: {
    title: 'Movimiento',
    type: 'date',
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

/*


import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';
export let goodCheck: any[] = [];

export const RECORDS_ACCOUNT_STATEMENTS_COLUMNS = {
  dateMotion: {
    title: 'Movimiento',
    type: 'date',
    sort: false,
  },
  deposit: {
    title: 'Abono',
    type: 'number',
    sort: false,
  },
  postDiverse: {
    title: 'Cargo',
    type: 'number',
    sort: false,
  },
  // numberGood: {
  //   title: 'Concepto',
  //   type: 'string',
  //   sort: false,
  // },
  // numberGood: {
  //   title: 'Concepto',
  //   type: 'custom',
  //   renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       if (data.toggle) {
  //         goodCheck.push(data);
  //       }
  //     });
  //   },
  //   sort: false,
  // },
  numberGood: {
    title: 'Concepto',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxDisabledElementComponent,
    valuePrepareFunction: (value: any, row: any) => {
      return {
        checked: value === null ? false : true,
        disabled: true,
      };
    },
    editor: {
      type: 'custom',
      component: CheckboxDisabledElementComponent,
    },
  },
};



*/
