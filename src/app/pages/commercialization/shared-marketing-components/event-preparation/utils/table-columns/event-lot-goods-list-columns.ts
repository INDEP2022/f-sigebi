import { format } from 'date-fns';

export const EVENT_LOT_GOODS_LIST_COLUMNS = {
  bienes: {
    title: 'No. Bien',
    sort: false,
    valuePrepareFunction: (good: any) => good?.id ?? '',
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
  },
  'bienes.description': {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.bienes?.description ?? '',
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
  },
  'transferente.cvman': {
    title: 'Transferente',
    sort: false,
    filter: false,
    valuePrepareFunction: (transfer: any) =>
      transfer
        ? `${transfer?.cvman ?? ''}-${transfer?.nameTransferent ?? ''}`
        : null,
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
  },
  'bienes.status': {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) => row.bienes?.status ?? '',
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  'bienes.appraisedValue': {
    title: 'Valor Avalúo',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.bienes?.appraisedValue ?? '',
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
  },
  commercialEventId: {
    title: 'Evento Participa',
    sort: false,
  },
  'lotepubremesa.description': {
    title: 'Lote Participa',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) => {
      return row.lotepubremesa?.description ?? null;
    },
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
  },
  remittanceEventId: {
    title: 'Evento Rem / Pre',
    sort: false,
  },
  'lotrepuborig.description': {
    title: 'Lote Rem / Pre',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) => {
      return row.lotrepuborig?.description ?? null;
    },
    filterFunction: (cell: any, search?: string) => {
      return true;
    },
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
    filter: false,
    valuePrepareFunction: (date: string) =>
      date ? format(new Date(date), 'dd/MM/yyyy') : '',
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
    filter: false,
    valuePrepareFunction: (date: string) =>
      date ? format(new Date(date), 'dd/MM/yyyy') : '',
  },
};
