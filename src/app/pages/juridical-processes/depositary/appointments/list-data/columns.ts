export const COLUMNS = {
  id: {
    title: 'Folio Universal',
    sort: false,
  },
  keyTypeDocument: {
    title: 'Tipo Documento',
    sort: false,
  },
  significantDate: {
    title: 'Fecha Significativa',
    sort: false,
    valuePrepareFunction: (value: string) => {
      return value;
    },
  },
};
