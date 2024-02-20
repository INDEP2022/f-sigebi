export const EVENT_LOT_LIST_COLUMNS = {
  publicLot: {
    title: 'Lote Público',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  baseValue: {
    title: 'Valor Base',
    sort: false,
  },
  clientId: {
    title: 'ID Cliente',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => row?.client?.id ?? null,
    filterFunction: (cell?: any, search?: string) => {
      return true;
    },
  },
  no_clasificacion_alterna: {
    title: 'No. Clasificación Alterna',
    sort: false,
  },
  rfc: {
    title: 'RFC.',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => row?.client?.rfc ?? null,
  },
  razonSocial: {
    title: 'Razón Social',
    sort: false,
    valuePrepareFunction: (value: any, row: any) =>
      row?.client?.reasonName ?? null,
  },
  warrantyPrice: {
    title: 'Precio Garantía',
    sort: false,
  },
  transferent: {
    title: 'Transferente',
    sort: false,
    valuePrepareFunction: (value: any) =>
      value?.cvman ? `${value?.cvman} - ${value?.nameTransferent}` : null,
  },
  cvman: {
    title: 'Mandato',
    sort: false,
    valuePrepareFunction: (value: any, row: any) =>
      row?.transferent?.cvman ?? null,
  },
  finalPrice: {
    title: 'Precio Final',
    sort: false,
  },
  referenceG: {
    title: 'Referencia G',
    sort: false,
  },
  referential: {
    title: 'Referencia L',
    sort: false,
  },
  statusVtaId: {
    title: 'Estatus Venta',
    sort: false,
  },
  assignedEs: {
    title: 'Asignado',
    sort: false,
  },
  scrapEs: {
    title: 'Chatarra',
    sort: false,
  },
  vatA: {
    title: 'Aplica IVA',
    sort: false,
  },
};
