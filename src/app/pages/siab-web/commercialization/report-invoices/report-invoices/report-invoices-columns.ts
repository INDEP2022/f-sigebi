export const REPORT_INVOICE_COLUMNS = {
  id_delegacion: {
    title: 'No. Delegación',
    sort: false,
  },
  descripcion: {
    title: 'Delegación',
    sort: false,
  },
  cuenta_fac: {
    title: 'Facturas Emitidas',
    sort: false,
  },
  porcentaje: {
    title: 'Porcentaje',
    sort: false,
  },
};

export const DETAIL_REPORT_COLUMNS = {
  evento: {
    title: 'Evento',
    type: 'string',
    sort: false,
  },
  id_factura: {
    title: 'Factura',
    type: 'number',
    sort: false,
  },
  id_lote: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  id_estatusfact: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    type: 'string',
    sort: false,
  },
  fecha: {
    title: 'Fecha',
    type: 'string',
    sort: false,
  },
  tpfactura: {
    title: 'Tipo de CFDI',
    type: 'string',
    sort: false,
  },
  tpbien: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  rutapdf: {
    title: 'Ruta PDF',
    type: 'string',
    sort: false,
    filter: false,
  },
  ferutaxml: {
    title: 'Ruta XML',
    type: 'string',
    sort: false,
    filter: false,
  },
};

/*{
  "color": "#636EBF",
    "cuenta_fac": "13",
      "descripcion": "Occidente",
        "id_delegacion": "6",
          "porcentaje": "100.00 %"
}*/
