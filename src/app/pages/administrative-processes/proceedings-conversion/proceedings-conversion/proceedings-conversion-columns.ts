export const COPY = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};

export const GOODSEXPEDIENT_COLUMNS_GOODS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  acta: {
    title: 'Acta',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.cveActa;
    },
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
};

export class IGoodStatus {
  goodClassNumber: string | number;
  goodStatus: string;
  goodId: string | number;
}

export class IConverGoodCreate {
  goodNumber: number | string;
  proceedingNumber: number;
}
export const ACTAS = {
  cve_acta_conv: {
    title: 'No. Conversión',
    type: 'number',
    sort: false,
  },
  tipo_acta: {
    title: 'Typo de Acta',
    type: 'string',
    sort: false,
  },
  folio_universal: {
    title: 'Folio Universal',
    type: 'string',
    sort: false,
  },
  emisora: {
    title: 'Emisora',
    type: 'string',
    sort: false,
  },
  administra: {
    title: 'Administra',
    type: 'string',
    sort: false,
  },
  ejecuta: {
    title: 'Ejecuta',
    type: 'string',
    sort: false,
  },
};
