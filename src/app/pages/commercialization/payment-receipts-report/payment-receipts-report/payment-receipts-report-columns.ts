export const PAY_RECEIPT_REPORT_COLUMNS_ = {
  noGood: {
    title: 'No. Bien',
    sort: false,
  },
  typeUbi: {
    title: 'Tipo y Ubicación del inmueble',
    sort: false,
  },
};

export const PAY_RECEIPT_REPORT_COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
  },
  numSubType: {
    title: 'Ubicación de Bien',
    type: 'list',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.numSubType.descriptionPhotography;
    },
  },
};
