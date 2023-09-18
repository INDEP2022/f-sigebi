import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
export const COLUMNS_APPROVAL_DONATION = {
  recordId: {
    title: 'Ref.',
    type: 'number',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good.goodNumber;
    },
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.description;
    },
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.quantity;
    },
  },
};

export const COPY = {
  recordId: {
    title: 'No. Ref',
    sort: false,
  },
  goodId: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.description;
    },
  },
  amount: {
    title: 'Cantidad',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodEntity?.unit;
    },
  },
  status: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodEntity?.status;
    },
  },
  noExpediente: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.bienindicadores?.noExpediente;
    },
  },
  noEtiqueta: {
    title: 'Etiqueta Destino',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodEntity?.noEtiqueta;
    },
  },
  idNoWorker1: {
    title: 'No. Tranf.',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.transference?.id;
    },
  },
  idExpWorker1: {
    title: 'Des. Tranf.',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.transference?.nameTransferent;
    },
  },
  noClasifBien: {
    title: 'No. Clasif.',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.clasificationGood;
    },
  },
  procesoExtDom: {
    title: 'Proceso',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.bienindicadores?.procesoExtDom;
    },
  },
  warehouseNumb: {
    title: 'No. Almacén',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.warehouse?.id;
    },
  },
  warehouse: {
    title: 'Descrip. Almacén',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.warehouse?.description;
    },
  },
  warehouseLocat: {
    title: 'Ubica. Almacén ',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.warehouse?.ubication;
    },
  },
  coordAdmin: {
    title: 'Coord. Admin.',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.bienindicadores?.coordination;
    },
  },
};

export const ACTAS = {
  estatusAct: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },

  actId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  cveAct: {
    title: 'Clave Acta',
    type: 'string',
    sort: false,
  },
  actType: {
    title: 'Tipo de Acta',
    type: 'string',
    sort: false,
  },
  fileId: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  elaborated: {
    title: 'Administra',
    type: 'string',
    sort: false,
  },
  folioUniversal: {
    title: 'Folio',
    type: 'string',
    sort: false,
  },
  captureDate: {
    title: 'Fecha de Captura',
    type: 'html',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  closeDate: {
    title: 'Fecha de Cierre',
    type: 'html',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
