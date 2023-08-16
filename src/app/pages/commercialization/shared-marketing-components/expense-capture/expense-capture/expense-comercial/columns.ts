export const COLUMNS = {
  expenseNumber: {
    title: 'Id',
    type: 'string',
    sort: false,
  },
  conceptNumber: {
    title: 'Concepto',
    type: 'string',
    sort: false,
  },
  conceptDescription: {
    title: 'Concepto Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.concepts ? row.concepts.description : null;
    },
  },
  good: {
    title: 'Bien',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.comerLot ? row.comerLot.goodsNumber : null;
    },
  },
  address: {
    title: 'Dirección',
    type: 'string',
    sort: false,
    class: 'w-md',
    filter: {},
    // editor: {
    //   type: 'list',
    //   config: {
    //     selectText: 'Seleccionar',
    //     list: [
    //       { value: '', title: 'SELECCIONAR' },
    //       { value: 'MUEBLES', title: 'MUEBLES' },
    //       { value: 'INMUEBLES', title: 'INMUEBLES' },
    //       { value: 'GENERAL', title: 'GENERAL' },
    //     ],
    //   },
    // },
  },
  paymentRequestNumber: {
    title: 'Solicitud Pago',
    type: 'string',
    sort: false,
  },
  comment: {
    title: 'Servicio',
    type: 'string',
    sort: false,
  },
  idOrdinginter: {
    title: 'OI Intercambio',
    type: 'string',
    sort: false,
  },
  eventNumber: {
    title: 'Evento',
    type: 'string',
    sort: false,
  },
  eventDescription: {
    title: 'Evento Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.comerEven ? row.comerEven.observations : null;
    },
  },
  lotNumber: {
    title: 'Lote',
    type: 'string',
    sort: false,
  },
  lotDescription: {
    title: 'Lote Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.comerLot ? row.comerLot.description : null;
    },
  },
  folioAtnCustomer: {
    title: 'Folio Atn. Cliente',
    type: 'string',
    sort: false,
  },
  dateOfResolution: {
    title: 'Fecha de Resolución',
    type: 'string',
    sort: false,
  },
  providerName: {
    title: 'Proveedor',
    type: 'string',
    sort: false,
  },
  invoiceRecNumber: {
    title: 'No. de Documento',
    type: 'string',
    sort: false,
  },
  numReceipts: {
    title: 'No. Comprobantes',
    type: 'string',
    sort: false,
  },
  invoiceRecDate: {
    title: 'Fecha Documento',
    type: 'string',
    sort: false,
  },
  payDay: {
    title: 'Fecha Pago',
    type: 'string',
    sort: false,
  },
  captureDate: {
    title: 'Fecha Captura',
    type: 'string',
    sort: false,
  },
  fecha_contrarecibo: {
    title: 'Fecha Contrarecibo',
    type: 'string',
    sort: false,
  },
  attachedDocumentation: {
    title: 'Documentación Anexa',
    type: 'string',
    sort: false,
  },
  monthExpense: {
    title: 'Enero',
    type: 'string',
    sort: false,
  },
  monthExpense2: {
    title: 'Febrero',
    type: 'string',
    sort: false,
  },
  monthExpense3: {
    title: 'Marzo',
    type: 'string',
    sort: false,
  },
  monthExpense4: {
    title: 'Abril',
    type: 'string',
    sort: false,
  },
  monthExpense5: {
    title: 'Mayo',
    type: 'string',
    sort: false,
  },
  monthExpense6: {
    title: 'Junio',
    type: 'string',
    sort: false,
  },
  monthExpense7: {
    title: 'Julio',
    type: 'string',
    sort: false,
  },
  monthExpense8: {
    title: 'Agosto',
    type: 'string',
    sort: false,
  },
  monthExpense9: {
    title: 'Setiembre',
    type: 'string',
    sort: false,
  },
  monthExpense10: {
    title: 'Octubre',
    type: 'string',
    sort: false,
  },
  monthExpense11: {
    title: 'Noviembre',
    type: 'string',
    sort: false,
  },
  monthExpense12: {
    title: 'Diciembre',
    type: 'string',
    sort: false,
  },
  exchangeRate: {
    title: 'Tipo de Cambio',
    type: 'string',
    sort: false,
  },
  formPayment: {
    title: 'Forma de Pago',
    type: 'string',
    sort: false,
  },
  comproafmandsae: {
    title: 'Comprobantes a Nombre',
    type: 'string',
    sort: false,
  },
  capturedUser: {
    title: 'Captura',
    type: 'string',
    sort: false,
  },
  nomEmplcapture: {
    title: 'Captura Nombre',
    type: 'string',
    sort: false,
  },
  authorizedUser: {
    title: 'Autoriza',
    type: 'string',
    sort: false,
  },
  nomEmplAuthorizes: {
    title: 'Autoriza Nombre',
    type: 'string',
    sort: false,
  },
  requestedUser: {
    title: 'Solicita',
    type: 'string',
    sort: false,
  },
  nomEmplRequest: {
    title: 'Solicita Nombre',
    type: 'string',
    sort: false,
  },
};
