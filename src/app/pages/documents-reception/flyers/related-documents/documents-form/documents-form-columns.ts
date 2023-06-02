export const DOCUMENTS_COLUMNS = {
  officialNumber: {
    title: 'Documento',
    type: 'string',
    sort: false,
  },
  key: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
};
