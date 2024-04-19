export const CAPTURA_LINES_COLUMNS = {
  lc: {
    title: 'ID',
    sort: false,
  },
  lote_publico: {
    title: 'LP',
    sort: false,
  },
  importe: {
    title: 'Importe',
    sort: false,
  },
  estatus: {
    title: 'Estado',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Estado',
        list: [
          { value: 'CAN', title: 'Cancelado' },
          { value: 'VAL', title: 'Valido' },
          { value: 'GEN', title: 'Generado' },
          { value: 'EFE', title: 'Pago en efectivo' },
          { value: 'CAE', title: 'Cancelado por pago en efectivo' },
        ],
      },
    },
    valuePrepareFunction: (text: string) => {
      const process = {
        CAS: () => 'Cancelado por usuario',
        CAN: () => 'Cancelado',
        VAL: () => 'Valido',
        GEN: () => 'Generado',
        EFE: () => 'Pago en efectivo',
        CAE: () => 'Cancelado por pago en efectivo',
      };
      return ['CAS', 'CAN', 'VAL', 'GEN', 'EFE', 'CAE'].includes(text)
        ? process[text]()
        : '';
    },
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
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  id_cliente: {
    title: 'ID Cliente',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  monto_pena: {
    title: 'Pena',
    sort: false,
  },
  note: {
    title: 'Nota',
    sort: false,
  },
};
