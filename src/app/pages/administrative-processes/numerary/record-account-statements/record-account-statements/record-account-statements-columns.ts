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
