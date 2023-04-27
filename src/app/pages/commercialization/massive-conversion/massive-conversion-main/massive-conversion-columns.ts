import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';

export const SETTING_DATA = {
  ...TABLE_SETTINGS,
  actions: false,
  columns: {
    eventId: {
      title: 'Id Evento',
      type: 'number',
      sort: false,
    },
    batchId: {
      title: 'Id Lote',
      type: 'number',
      sort: false,
    },
    batch: {
      title: 'Lote',
      type: 'number',
      sort: false,
      valuePrepareFunction: (_cell: any, item: any) => {
        return item?.comerLots?.lotPublic;
      },
    },
    customerId: {
      title: 'Id Cliente',
      type: 'number',
      sort: false,
    },
    rfc: {
      title: 'R.F.C.',
      type: 'string',
      sort: false,
      valuePrepareFunction: (_cell: any, item: any) => {
        return item?.comerClient?.rfc;
      },
    },
    amount: {
      title: 'Monto $',
      type: 'number',
      sort: false,
    },
    validityDate: {
      title: 'Fecha Vigencia',
      type: 'string',
      sort: false,
    },
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    bankExpCheck: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    status: {
      title: 'Estatus',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, _row: any) => {
        if (cell == 1) return 'LC GENERADA';
        if (cell == 0) return 'SOLICITADA';
        return '';
      },
    },
    observations: {
      title: 'Observaciones',
      type: 'number',
      sort: false,
      valuePrepareFunction: (_cell: any, item: any) => {
        let observation = '';
        if (!item.customerId) {
          observation += 'No se ingreso el cliente. ';
        }
        if (!item.batchId) {
          observation += 'No se ingreso el lote. ';
        }
        if (!item.comerClient == null) {
          observation += 'El ID Cliente no Existe. ';
        }

        if (!item.comerLots == null) {
          observation += 'El ID Lote no Existe. ';
        }

        if (!item.amount) {
          observation += 'No se ingreso el monto. ';
        }

        if (!item.validityDate) {
          observation += 'No se ingreso la fecha de vigencia. ';
        }
        if (!item.checkNumber) {
          observation += 'No se ingreso el número de cheque. ';
        }
        if (!item.bankExpCheck) {
          observation += 'No se ingreso el Expide. Cheque. ';
        }
        // console.log({ observation });
        return observation;
      },
    },
  },
};

export const SETTING_LCS = {
  ...TABLE_SETTINGS,
  actions: false,
  columns: {
    idlcg: {
      title: 'Id Lcg',
      type: 'number',
      sort: false,
    },
    idEvent: {
      title: 'Id Evento',
      type: 'number',
      sort: false,
    },
    idBatch: {
      title: 'Id Lote',
      type: 'number',
      sort: false,
    },
    idCustomer: {
      title: 'Id Cliente',
      type: 'number',
      sort: false,
    },
    amount: {
      title: 'Monto',
      type: 'number',
      sort: false,
    },
    refGsae: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    refGbank: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    dateValidity: {
      title: 'Fecha Videncia',
      type: 'string',
      sort: false,
    },
    status: {
      title: 'Estatus',
      type: 'string',
      sort: false,
    },
    dateRecord: {
      title: 'Fecha Registro',
      type: 'string',
      sort: false,
    },
    bankExpCheck: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    numberCheck: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
  },
};

export const SETTING_RFC = {
  ...TABLE_SETTINGS,
  actions: {
    columnTitle: 'Acciones',
    position: 'left',
    add: true,
    edit: true,
    delete: true,
  },
  columns: {
    rfc: {
      title: 'R.F.C.',
      type: 'string',
      sort: false,
    },
    batch: {
      title: 'Id Lote',
      type: 'number',
      sort: false,
    },
    amount: {
      title: 'Monto',
      type: 'number',
      sort: false,
    },
    palette: {
      title: 'Paleta',
      type: 'number',
      sort: false,
    },
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    checkBank: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    validityDate: {
      title: 'Fecha Vigencia',
      type: 'string',
      sort: false,
    },
    gsaeRef: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    gbankRef: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    status: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    registerDate: {
      title: 'Fec. Registro',
      type: 'string',
      sort: false,
    },
    type: {
      title: 'Tipo',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_CLIENT_ID = {
  ...TABLE_SETTINGS,
  actions: {
    columnTitle: 'Acciones',
    position: 'left',
    add: true,
    edit: true,
    delete: true,
  },
  columns: {
    clientId: {
      title: 'Id cliente',
      type: 'number',
      sort: false,
    },
    batch: {
      title: 'Id Evento',
      type: 'number',
      sort: false,
    },
    amount: {
      title: 'Monto',
      type: 'number',
      sort: false,
    },
    palette: {
      title: 'Paleta',
      type: 'number',
      sort: false,
    },
    checkNumber: {
      title: 'N° Cheque',
      type: 'number',
      sort: false,
    },
    checkBank: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    validityDate: {
      title: 'Fecha Videncia',
      type: 'string',
      sort: false,
    },
    gsaeRef: {
      title: 'Ref. Gsae',
      type: 'string',
      sort: false,
    },
    gbankRef: {
      title: 'Ref. Gbanco',
      type: 'number',
      sort: false,
    },
    status: {
      title: 'Banco Exp. Cheque',
      type: 'string',
      sort: false,
    },
    registerDate: {
      title: 'Fec. Registro',
      type: 'string',
      sort: false,
    },
    type: {
      title: 'Tipo',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_BATCH_REWORK = {
  ...TABLE_SETTINGS,
  selectMode: 'multi',
  attr: {
    class: 'table-bordered center-checkbox',
  },
  columns: {
    batch: {
      title: 'Lote Público',
      type: 'number',
      sort: false,
    },
    description: {
      title: 'Descripción ',
      type: 'string',
      sort: false,
    },
  },
};

export const SETTING_RFC_REWORK = {
  ...TABLE_SETTINGS,
  selectMode: 'multi',
  attr: {
    class: 'table-bordered center-checkbox',
  },
  columns: {
    rfc: {
      title: 'R.F.C.',
      type: 'number',
      sort: false,
    },
    name: {
      title: 'Nombre o Denominación',
      type: 'string',
      sort: false,
    },
  },
};
