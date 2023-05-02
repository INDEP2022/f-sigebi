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
