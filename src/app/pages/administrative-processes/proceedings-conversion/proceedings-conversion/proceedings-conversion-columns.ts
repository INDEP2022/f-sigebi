import { ProceedingsConversionComponent } from './proceedings-conversion.component';
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
    type: 'custom',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.cveActa;
    },
  },
  // status: {
  //   title: 'Estatus',
  //   type: 'string',
  //   sort: false,
  // },
  rowClassFunction: (row: any) => {
    if (row.status === 'CNE') {
      return 'row-verde';
    } else if (row.status === 'RRE' || row.status === 'VXR') {
      return 'row-negro';
    } else {
      return 'row-verde';
    }
  },
};

export const APPLY_DATA_COLUMNS = (keyValueObj: any) => {
  let objResponse: any = {};
  if (keyValueObj == 'descripcion') {
    objResponse = {
      title: keyValueObj.toLocaleUpperCase(),
      type: 'custom',
      sort: false,
      renderComponent: ProceedingsConversionComponent,
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
      renderComponent: ProceedingsConversionComponent,
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
      renderComponent: ProceedingsConversionComponent,
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
        ? GOODSEXPEDIENT_COLUMNS_GOODS
        : OFFICE_DATA_COLUMNS.includes(keyValueObj)
        ? OFFICE_COLOR_DATA_COLUMN
        : GOOD_COLOR_DATA_COLUMN,
    };
  }
  return objResponse;
};
export const GOOD_COLOR_DATA_COLUMN = ''; //'bg-secondary text-dark';
export const WHEEL_COLOR_DATA_COLUMN = 'bg-success text-light';
const WHEEL_DATA_COLUMNS = ['idConversion'];

export const OFFICE_COLOR_DATA_COLUMN = 'bg-info text-light';
const OFFICE_DATA_COLUMNS = ['idConversion'];

export class IGoodStatus {
  goodClassNumber: string | number;
  goodStatus: string;
  goodId: string | number;
}

export class IConverGoodCreate {
  goodNumber: number | string;
  proceedingNumber: number;
}
