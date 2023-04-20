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
  descriptionDocument: {
    title: 'Descripción del Documento',
    sort: false,
  },
  natureDocument: {
    title: 'Naturaleza',
    sort: false,
  },
  keySeparator: {
    title: 'Clave Separador',
    sort: false,
  },
  numberProceedings: {
    title: 'No. Expediente',
    sort: false,
  },
  flyerNumber: {
    title: 'No. Volante',
    sort: false,
  },
};
