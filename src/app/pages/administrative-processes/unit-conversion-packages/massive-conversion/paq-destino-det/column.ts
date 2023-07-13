export const COLUMNS = {
  numberGood: {
    title: 'Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.bienes && row.bienes.description) {
        return row.bienes.description;
      } else {
        return null;
      }
    },
  },
  record: {
    title: 'Expediente',
    sort: false,
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
  },
  val24: {
    title: 'Prog. Chatarra',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.bienes && row.bienes.val24) {
        return row.bienes.val24;
      } else {
        return null;
      }
    },
  },
};
