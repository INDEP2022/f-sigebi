export const DOCUMENTS_COLUMNS = {
  key: {
    title: 'cve_documentos',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any) => {
      return value.key;
    },
  },
  key2: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.key == null) return '';
      if (row.key != null) return row.key.description;
    },
  },
  dateReceipt: {
    title: 'Fecha. Recibido',
    sort: false,
  },
};
