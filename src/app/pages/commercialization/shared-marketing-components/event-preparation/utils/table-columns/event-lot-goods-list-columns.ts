export const EVENT_LOT_GOODS_LIST_COLUMNS = {
  bienes: {
    title: 'No. Bien',
    sort: false,
    valuePrepareFunction: (good: any) => good?.id ?? '',
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.bienes?.description ?? '',
  },
  transferente: {
    title: 'Transferente',
    sort: false,
    valuePrepareFunction: (transfer: any) =>
      transfer
        ? `${transfer?.cvman ?? ''}-${transfer?.nameTransferent ?? ''}`
        : null,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) => row.bienes?.status ?? '',
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  valoravaluo: {
    title: 'Valor Avalúo',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.bienes?.appraisedValue ?? '',
  },
  commercialEventId: {
    title: 'Evento Participa',
    sort: false,
  },
  lotepubremesa: {
    title: 'Lote Participa',
    sort: false,
  },
  remittanceEventId: {
    title: 'Evento Rem / Pre',
    sort: false,
  },
  lotrepuborig: {
    title: 'Lote Rem / Pre',
    sort: false,
  },
  baseValue: {
    title: 'Valor Base',
    sort: false,
  },
  finalPrice: {
    title: 'Precio Final',
    sort: false,
  },
  priceWithoutIva: {
    title: 'Precio Sin I.V.A.',
    sort: false,
  },
  finalIva: {
    title: 'I.V.A. Final',
    sort: false,
  },
  amountWithoutVat: {
    title: 'Monto no App I.V.A.',
    sort: false,
  },
  field1: {
    title: 'Campo 1',
    sort: false,
  },
  field2: {
    title: 'Campo 2',
    sort: false,
  },
  field3: {
    title: 'Campo 3',
    sort: false,
  },
  field4: {
    title: 'Campo 4',
    sort: false,
  },
  field5: {
    title: 'Campo 5',
    sort: false,
  },
  field6: {
    title: 'Campo 6',
    sort: false,
  },
  field7: {
    title: 'Campo 7',
    sort: false,
  },
  field8: {
    title: 'Campo 8',
    sort: false,
  },
  field9: {
    title: 'Campo 9',
    sort: false,
  },
  cylinderNumber: {
    title: 'No. Cilindros',
    sort: false,
  },
  origin: {
    title: 'Procedencia',
    sort: false,
  },
  countryOfOrigin: {
    title: 'País Procedencia',
    sort: false,
  },
  appraisalDate: {
    title: 'Fecha Avalúo',
    sort: false,
  },
  warehouseNumber: {
    title: 'No. Almacén',
    sort: false,
  },
  annex: {
    title: 'Anexo',
    sort: false,
  },
  invoiceNumber: {
    title: 'No. Factura',
    sort: false,
  },
  invoiceDate: {
    title: 'Fecha Factura',
    sort: false,
  },
};
