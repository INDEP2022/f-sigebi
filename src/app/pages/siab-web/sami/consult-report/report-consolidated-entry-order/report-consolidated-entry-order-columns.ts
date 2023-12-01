export const ORDER_SERVICE_COLUMNS = {
  id: {
    title: 'No. Orden Ingreso',
    type: 'number',
    sort: false,
  },

  concept: {
    title: 'Concepto',
    type: 'string',
    sort: false,
  },

  shapePay: {
    title: 'Forma de Pago',
    type: 'string',
    sort: false,
  },

  amount: {
    title: 'Importe',
    type: 'number',
    sort: false,
  },

  numberreference: {
    title: 'No. Referencia',
    type: 'string',
    sort: false,
  },

  thirdesp: {
    title: 'Tercero Especializado',
    type: 'string',
    sort: false,
  },

  institutionBanking: {
    title: 'Institución Bancaria',
    type: 'string',
    sort: false,
  },

  orderDate: {
    title: 'Fecha Orden',
    type: 'string',
    sort: false,
  },

  identifier: {
    title: 'Identificador',
    type: 'string',
    sort: false,
  },

  nameProcess: {
    title: 'Nombre Proceso',
    type: 'string',
    sort: false,
  },

  startDate: {
    title: 'Fecha Inicio',
    type: 'string',
    sort: false,
  },

  endDate: {
    title: 'Fecha Fin',
    type: 'string',
    sort: false,
  },

  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },

  delegationRegionalId: {
    title: 'Delegación Regional',
    type: 'string',
    sort: false,
  },

  contentId: {
    title: 'Id Contenido',
    type: 'string',
    sort: false,
  },

  contractNumber: {
    title: 'No. Contrato',
    type: 'string',
    sort: false,
  },

  cadGoods: {
    title: 'Cad. Bienes',
    type: 'string',
    sort: false,
  },

  limePayDate: {
    title: 'Fecha Limite de Pago',
    type: 'string',
    sort: false,
  },

  checkNumber: {
    title: 'No. cheque',
    type: 'string',
    sort: false,
  },

  guyCurrency: {
    title: 'Tipo de Moneda',
    type: 'string',
    sort: false,
  },

  unitadministrative: {
    title: 'Unidad Administrativa',
    type: 'string',
    sort: false,
  },
};

export const ORDER_SERVICE_PAYMENT_COLUMN = {
  idOrderService: {
    title: 'No. Orden de Servicio',
    type: 'number',
    sort: false,
  },

  folioOrderService: {
    title: 'Folio Orden de Servicio',
    type: 'string',
    sort: false,
  },

  typeOrderService: {
    title: 'Tipo Orden de Servicio',
    type: 'string',
    sort: false,
  },

  transferent: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },

  costService: {
    title: 'Costo Servicio',
    type: 'number',
    sort: false,
  },

  notes: {
    title: 'Notas',
    type: 'string',
    sort: false,
  },

  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },

  noFacture: {
    title: 'No. factura',
    type: 'string',
    sort: false,
  },

  dateFacture: {
    title: 'Fecha Factura',
    type: 'string',
    sort: false,
  },
};

export const CREDIT_NOTS_COLUMNS = {
  idNoteCredit: {
    title: 'No. Nota de credito',
    type: 'number',
    sort: false,
  },

  montPago: {
    title: 'Monto Pago',
    type: 'number',
    sort: false,
  },

  porcDeduction: {
    title: 'Porcentaje Deducción',
    type: 'number',
    sort: false,
  },

  montDeduction: {
    title: 'Monto de Deducción',
    type: 'number',
    sort: false,
  },

  indAplicate: {
    title: 'Ind. Aplicado',
    type: 'string',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
};

export const DETAIL_GOODS_COLUMNS = {
  cost: {
    title: 'Costo',
    type: 'number',
    sort: false,
  },

  orderEntryId: {
    title: 'No. Orden Ingreso',
    type: 'number',
    sort: false,
  },

  transactionId: {
    title: 'No. Transacción',
    type: 'number',
    sort: false,
  },

  store: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },

  transaction: {
    title: 'Transacción 1',
    type: 'string',
    sort: false,
  },

  descriptionGood: {
    title: 'Descripción del Bien',
    type: 'string',
    sort: false,
  },

  item: {
    title: 'Item',
    type: 'string',
    sort: false,
  },

  siabGoodNumber: {
    title: 'No. bien Siab',
    type: 'number',
    sort: false,
  },

  inventoryNumber: {
    title: 'No. Inventario',
    type: 'string',
    sort: false,
  },

  amountNotDelivered: {
    title: 'Suma de Bienes no Entregados',
    type: 'number',
    sort: false,
  },

  reasonsNotDelivered: {
    title: 'Causa no Entrega',
    type: 'string',
    sort: false,
  },
};

export const DETAIL_GOODS_ORDER_ENTRY_COLUMNS = {
  cost: {
    title: 'Costo',
    type: 'number',
    sort: false,
  },

  idTransaction: {
    title: 'No. Transacción',
    type: 'number',
    sort: false,
  },

  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },

  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },

  stateGood: {
    title: 'Estado Bien',
    type: 'string',
    sort: false,
  },

  observationStateGood: {
    title: 'Observaciones Estado Bien',
    type: 'string',
    sort: false,
  },
};

export const SERVICES_COLUMNS = {
  typeOrderService: {
    title: 'Tipo Orden Servicio',
    type: 'string',
    sort: false,
  },

  comply: {
    title: 'Cumplidos',
    type: 'string',
    sort: false,
  },

  missing: {
    title: 'Faltantes',
    type: 'string',
    sort: false,
  },

  total: {
    title: 'Total',
    type: 'number',
    sort: false,
  },

  porcCump: {
    title: 'Porcentaje Cumplido',
    type: 'string',
    sort: false,
  },

  porcFalt: {
    title: 'Porcentaje Faltante',
    type: 'string',
    sort: false,
  },

  sumTotal: {
    title: 'Suma Total',
    type: 'number',
    sort: false,
  },

  PorcPenaConvencional: {
    title: 'Porcentaje Convencional',
    type: 'number',
    sort: false,
  },

  penaConvencional: {
    title: 'Pena Convencional',
    type: 'string',
    sort: false,
  },

  porcDeductive: {
    title: 'Porcentaje Deductiva',
    type: 'number',
    sort: false,
  },

  deductive: {
    title: 'Deductiva',
    type: 'string',
    sort: false,
  },

  porcPenaVerification: {
    title: 'Porcentaje Verificación',
    type: 'number',
    sort: false,
  },

  penaVerification: {
    title: 'Pena. Verificación',
    type: 'number',
    sort: false,
  },
};

export const ORDER_PAY_COLUMNS = {
  orderIncomeId: {
    title: 'No. Orden Pago',
    type: 'string',
    sort: false,
  },

  orderPayDate: {
    title: 'Fecha Orden Pago',
    type: 'string',
    sort: false,
  },

  areaApplicant: {
    title: 'Area Solicitante',
    type: 'string',
    sort: false,
  },

  addressAreaApplication: {
    title: 'Dirección Area Solicitante',
    type: 'string',
    sort: false,
  },

  beneficiary: {
    title: 'Beneficiario',
    type: 'string',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
};

export const ORDER_SERVICE_ORDER_COLUMNS = {
  id: {
    title: 'No. Orden de Servicio',
    type: 'number',
    sort: false,
  },

  serviceOrderFolio: {
    title: 'Folio Orden de Servicio',
    type: 'string',
    sort: false,
  },

  serviceOrderType: {
    title: 'Tipo Orden de Servicio',
    type: 'string',
    sort: false,
  },

  transferentName: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },

  serviceCost: {
    title: 'Costo Servicio',
    type: 'number',
    sort: false,
  },

  notes: {
    title: 'Notas',
    type: 'string',
    sort: false,
  },

  observation: {
    title: 'Observación',
    type: 'string',
    sort: false,
  },
};
