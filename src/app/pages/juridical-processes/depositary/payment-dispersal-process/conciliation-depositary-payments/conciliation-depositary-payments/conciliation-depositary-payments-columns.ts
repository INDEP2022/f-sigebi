export const TABLE_SETTINGS_FACT_GEN = {
  actions: {
    columnTitle: '',
    add: false,
    edit: false,
    delete: false,
  },
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa

  columns: {
    fechaDepositaria: {
      title: 'Fecha',
    },
    tipoDepositaria: {
      title: 'Tipo',
    },
    nDiasDepositaria: {
      title: 'N. Días',
    },
    fecRecep: {
      title: 'Fec. Recep',
    },
    usuRecep: {
      title: 'Usu. Recep',
    },
    area: {
      title: 'Ärea',
    },
    nDias: {
      title: 'N. Días',
    },
    fecCierre: {
      title: 'Fec. Cierre',
    },
    usuarioCierre: {
      title: 'Usuario Cierre',
    },
  },
};

export const TABLE_SETTINGS_DISPERSION_PAGOS = {
  actions: {
    columnTitle: '',
    add: false,
    edit: false,
    delete: false,
  },
  hideSubHeader: true, //oculta subheaader de filtro
  mode: 'external', // ventana externa

  columns: {
    noPago: { title: 'No. Pago' },
    idPago: { title: 'ID. Pago' },
    noBien: { title: 'No. Bien' },
    montoMensual: { title: 'Monto Mensual' },
    referencia: { title: 'Referencia' },
    montoSinIva: { title: 'Monto Sin IVA' },
    iva: { title: 'IVA' },
    montoIva: { title: 'Monto IVA' },
    abonoComp: { title: 'Abono/Comp.' }, // Abono/Comp.
    pagoActual: { title: 'Pago Actual' },
    recGastPorcentaje: { title: 'Rec. Gast. %' }, // Rec. Gast. %
    recGastValor: { title: 'Rec. Gast. Valor' }, // Rec. Gast. Valor
    pago: { title: 'Pago' }, // Select
    reconocimientoGastos: { title: 'Reconocimiento Gastos' }, // % -- Valor
  },
};
