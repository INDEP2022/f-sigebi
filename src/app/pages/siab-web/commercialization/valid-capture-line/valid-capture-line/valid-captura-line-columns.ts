export const VALID_CAPTURE_LINE_COLUMNS = {
  lc: {
    title: 'Id',
    sort: false,
  },
  lote_publico: {
    title: 'Lote Publico',
    sort: false,
  },
  importe: {
    title: 'Monto',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  tipo: {
    title: 'Tipo',
    sort: false,
  },
  referencia: {
    title: 'Referencia',
    sort: false,
  },
  fec_vigencia: {
    title: 'Fecha Vigencia',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  id_cliente: {
    title: 'Id Cliente',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  tipo_ref: {
    title: 'Tipo Ref',
    sort: false,
  },
};
