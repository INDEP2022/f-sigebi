export const registrosMovidos: IDetailProceedingsDeliveryReceptionNew[] = [];

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
  cell: {
    class: (value: any, row: any) => {
      if (registrosMovidos.includes(row)) {
        return 'registros-movidos';
      }
      return '';
    },
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

<<<<<<< HEAD
export const APPLY_DATA_COLUMNS = (keyValueObj: any) => {
  let objResponse: any = {};
  if (keyValueObj == 'descripcion') {
    objResponse = {
      title: keyValueObj.toLocaleUpperCase(),
      type: 'custom',
      sort: false,
      renderComponent: ProceedingsConversionComponent,
      valuePrepareFunction: (value: string) => {
        console.log(value);
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
        console.log(value);

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
        console.log(value);

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
=======
export const ACTAS = {
  statusProceedings: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  keysProceedings: {
    title: 'Cve Acta',
    type: 'string',
    sort: false,
  },
  idTypeProceedings: {
    title: 'Tipo de Acta',
    type: 'string',
    sort: false,
  },
  // file: {
  //   title: 'No. Expediente',
  //   type: 'number',
  //   sort: false,
  //   valuePrepareFuncion: (cell: any, row: any) => {
  //     return row.file.filesId
  //   }
  // },
  approvalUserXAdmon: {
    title: 'Administra',
    type: 'string',
    sort: false,
  },
  numeraryFolio: {
    title: 'Folio Universal',
    type: 'string',
    sort: false,
  },
  numTransfer: {
    title: 'Trasnfer',
    type: 'number',
    sort: false,
  },
  dateElaborationReceipt: {
    title: 'Fecha de Elaboración',
    type: 'string',
    sort: false,
  },
>>>>>>> 7563eb767473b032460bcee082c28dcfc2d6ef5b
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

export class IDetailProceedingsDeliveryReceptionNew {
  numberProceedings: number;
  numberGood: number | string;
  amount: number;
}
