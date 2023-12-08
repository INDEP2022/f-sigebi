import { ITransferee } from 'src/app/core/models/ms-r-approve-donation/r-approve-donation.model';
export const COLUMNS_DATA_TABLE = {
  labelId: {
    title: 'Etiqueta',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  desStatus: {
    title: 'Des. Status',
    type: 'string',
    sort: false,
  },
  transfereeId: {
    title: 'No. Trans.',
    valuePrepareFunction: (value: ITransferee) => {
      return value != null ? value.transferentId : '-';
    },
    type: 'number',
    sort: false,
  },
  desTrans: {
    title: 'Des Trans.',
    type: 'string',
    sort: false,
  },
  clasifId: {
    title: 'No. Clasif.',
    type: 'number',
    sort: false,
  },
  desClasif: {
    title: 'Des. Clasif.',
    type: 'string',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  // yes: {
  //   title: 'S',
  //   type: 'custom',
  //   renderComponent: CheckboxElementComponent_,
  //   onComponentInitFunction(instance: any) {
  //     if (instance?.toggle) {
  //       instance.toggle.subscribe((data: any) => {
  //         data.row.to = data.toggle;
  //       });
  //     }
  //   },
  //   filter: {
  //     type: 'checkbox',
  //     config: {
  //       true: true,
  //       false: false,
  //       resetText: ' ',
  //     },
  //   },
  //   filterFunction(cell?: any, search?: string): boolean {
  //     return true;
  //   },
  //   sort: false,
  // },
  // not: {
  //   title: 'N',
  //   type: 'custom',
  //   // filter: false,
  //   renderComponent: CheckboxElementComponent_,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       data.row.to = data.toggle;
  //     });
  //   },
  //   filter: {
  //     type: 'checkbox',
  //     config: {
  //       true: true,
  //       false: false,
  //       resetText: ' ',
  //     },
  //   },
  //   filterFunction(cell?: any, search?: string): boolean {
  //     return true;
  //   },
  //   sort: false,
  // },
  valid: {
    title: 'Válida',
    type: 'string',
    sort: false,
    width: '12%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'SI' },
          { value: '0', title: 'NO' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.valid == '0') {
        return 'NO';
      } else if (row.valid == '1') {
        return 'SI';
      } else {
        return row.valid;
      }
    },
  },
};
