export const COLUMNS_DOCUMENTS = {
  key: {
    sort: false,
    title: 'CVE',
    type: 'string',
    valuePrepareFunction: (cell: any, row: any) => {
      console.log('Info de ', row.documentDetails.key);
      if (row == null) return '';
      if (row != null) return row.documentDetails.key;
    },
  },
  documentDetails: {
    sort: false,
    title: 'Descripçión',
    type: 'string',
    valuePrepareFunction: (cell: any, row: any) => {
      console.log('Info de ', row.documentDetails.description);
      if (row == null) return '';
      if (row != null) return row.documentDetails.description;
    },
  },
  date: {
    sort: false,
    title: 'Fecha',
  },
};
