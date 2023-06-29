export const PROCEEDINGSCONVERSION_COLUMNS = {
  notGood: {
    title: 'No Bien',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    width: '20%',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    width: '10%',
    sort: false,
  },
  goodStatus: {
    title: 'Estatus',
    width: '10%',
    sort: false,
  },
  rowClassFunction: (row: any) => {
    if (row.goodStatus === 'disponible') {
      return 'row-verde';
    } else if (row.goodStatus === 'no disponible') {
      return 'row-negro'; // Clase CSS para filas inactivas
    } else {
      return 'row-verde'; // Clase CSS para filas activas
    }
  },
};
export const COPY = {
  goodId: {
    title: 'No Bien',
    width: '10%',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.goodId;
    // },
  },
  description: {
    title: 'Descripcion',
    width: '20%',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.description;
    // },
  },
  amount: {
    title: 'Cantidad',
    width: '10%',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.amount;
    // },
  },
  goodStatus: {
    title: 'Estatus',
    width: '10%',
    sort: false,
  },
};
export const PROCEEDINGSCONVERSIONS_COLUMNS = {
  notGood: {
    title: 'No Bien',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    width: '20%',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    width: '10%',
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
    type: 'custom',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.fileNumber.minutesErNumber;
    },
  },
  // status: {
  //   title: 'Estatus',
  //   type: 'string',
  //   sort: false,
  // },
  // desEstatus: {
  //   title: 'Des. Estatus',
  //   type: 'string',
  //   sort: false,
  //   hide: true,
  // },
};

import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const GOODS_BULK_LOAD_COLUMNS = {
  noBien: {
    title: 'No',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Volante',
    type: 'string',
    sort: false,
  },
  ident: {
    title: 'Bien',
    type: 'string',
    sort: false,
  },
  est: {
    title: 'No especificado',
    type: 'string',
    sort: false,
  },
  proceso: {
    title: 'No especificado',
    type: 'string',
    sort: false,
  },
};

export const APPLY_DATA_COLUMNS = (keyValueObj: any) => {
  let objResponse: any = {};
  if (keyValueObj == 'descripcion') {
    objResponse = {
      title: keyValueObj.toLocaleUpperCase(),
      type: 'custom',
      sort: false,
      renderComponent: SeeMoreComponent,
      valuePrepareFunction: (value: string) => {
        if (value == 'null' || value == 'undefined') {
          return '';
        }

        return value ? value : '';
      },
      class: WHEEL_DATA_COLUMNS.includes(keyValueObj)
        ? WHEEL_COLOR_DATA_COLUMN
        : OFFICE_DATA_COLUMNS.includes(keyValueObj)
        ? OFFICE_COLOR_DATA_COLUMN
        : GOOD_COLOR_DATA_COLUMN,
    };
  } else if (keyValueObj == 'descbien') {
    objResponse = {
      title: keyValueObj.toLocaleUpperCase(),
      type: 'custom',
      sort: false,
      renderComponent: SeeMoreComponent,
      valuePrepareFunction: (value: string) => {
        if (value == 'null' || value == 'undefined') {
          return '';
        }

        return value ? value : '';
      },
      class: WHEEL_DATA_COLUMNS.includes(keyValueObj)
        ? WHEEL_COLOR_DATA_COLUMN
        : OFFICE_DATA_COLUMNS.includes(keyValueObj)
        ? OFFICE_COLOR_DATA_COLUMN
        : GOOD_COLOR_DATA_COLUMN,
    };
  } else if (keyValueObj == 'observaciones') {
    objResponse = {
      title: keyValueObj.toLocaleUpperCase(),
      type: 'custom',
      sort: false,
      renderComponent: SeeMoreComponent,
      valuePrepareFunction: (value: string) => {
        if (value == 'null' || value == 'undefined') {
          return '';
        }

        return value ? value : '';
      },
      class: WHEEL_DATA_COLUMNS.includes(keyValueObj)
        ? WHEEL_COLOR_DATA_COLUMN
        : OFFICE_DATA_COLUMNS.includes(keyValueObj)
        ? OFFICE_COLOR_DATA_COLUMN
        : GOOD_COLOR_DATA_COLUMN,
    };
  } else {
    objResponse = {
      title: keyValueObj.toLocaleUpperCase(),
      type: 'string',
      sort: false,
      class: WHEEL_DATA_COLUMNS.includes(keyValueObj)
        ? WHEEL_COLOR_DATA_COLUMN
        : OFFICE_DATA_COLUMNS.includes(keyValueObj)
        ? OFFICE_COLOR_DATA_COLUMN
        : GOOD_COLOR_DATA_COLUMN,
    };
  }
  return objResponse;
};
export const GOOD_COLOR_DATA_COLUMN = ''; //'bg-secondary text-dark';
export const WHEEL_COLOR_DATA_COLUMN = 'bg-success text-light';
const WHEEL_DATA_COLUMNS = [
  'tipovolante',
  'remitente',
  'identificador',
  'asunto',
  'exptrans',
  // 'descripcion',
  'ciudad',
  'entfed',
  'contribuyente',
  'transferente',
  'viarecepcion',
  'areadestino',
  'gestiondestino',
  'observaciones',
  'autoridad',
];

export const OFFICE_COLOR_DATA_COLUMN = 'bg-info text-light';
const OFFICE_DATA_COLUMNS = ['nooficio', 'fgrnobien', 'FGRNOBIEN', 'fecoficio'];

export class IGoodStatus {
  goodClassNumber: string | number;
  goodStatus: string;
  goodId: string | number;
}
