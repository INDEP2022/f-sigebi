export const COLUMNS = {
  numberGood: {
    title: 'No. Bien',
    sort: false,
    editable: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    editable: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.bienes && row.bienes.description) {
        return (
          'BIEN INTEGRADO A PAQUETE DE CONVERSIÓN NO. ' +
          row.numberPackage +
          '. ' +
          row.bienes.description
        );
      } else {
        return null;
      }
    },
  },
  record: {
    title: 'Expediente',
    sort: false,
    editable: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.bienes && row.bienes.fileNumber) {
        return row.bienes.fileNumber;
      } else {
        return null;
      }
    },
  },
  originalUnit: {
    title: 'Unidad Original',
    sort: false,
    editable: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.bienes && row.bienes.unit) {
        return row.bienes.unit;
      } else {
        return null;
      }
    },
  },
  amount: {
    title: 'Cantidad Original',
    sort: false,
    editable: false,
  },
  // val24: {
  //   title: 'Prog. Chatarra',
  //   sort: false,
  //   editable: true,
  //   type: 'custom',
  //   renderComponent: CheckboxDisabledElementComponent,
  //   valuePrepareFunction: (cell: any, row: any) => {
  //     return {
  //       checked: row.bienes && row.bienes.val24 ? true : false,
  //       disabled: true,
  //     };
  //   },
  //   editor: {
  //     type: 'custom',
  //     component: CheckboxDisabledElementComponent,
  //   },
  // },
};
