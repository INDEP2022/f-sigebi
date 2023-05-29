export const DOCUMENTS_COLUMNS = {
  cveDocument: {
    title: 'Document',
    type: 'string',
    sort: false,
  },
  documentDetails: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
};
