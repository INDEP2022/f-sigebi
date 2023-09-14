export const PRORRATEGO_GOODS_COLUMNS = {
  goodNumberId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  additionInsured: {
    title: 'Suma Asegurada',
    type: 'string',
    sort: false,
  },
  amountCousin: {
    title: 'Monto Prima',
    type: 'text',
    sort: false,
  },
  location: {
    title: 'Ubicación',
    type: 'text',
    sort: false,
  },
  shortDate: {
    title: 'Fecha Baja',
    type: 'date',
    sort: false,
  },
  statusGood: {
    title: 'Estatus Bien',
    type: 'string',
    sort: false,
  },
  factorCostDaily: {
    title: 'Costo Diario',
    type: 'string',
    sort: false,
  },
  amountNoteCredit: {
    title: 'Nota Crédito',
    type: 'text',
    sort: false,
  },
  di_dias_trans: {
    title: 'Dias Transcurridos',
    type: 'text',
    sort: false,
    valuePrepareFunction: (value: number) => {
      if (value > 0) {
        return value;
      } else {
        return '0';
      }
    },
  },
  daysPassed: {
    title: 'Dias Fatantes',
    sort: false,
    valuePrepareFunction: (value: number) => {
      if (value > 0) {
        return value;
      } else {
        return '0';
      }
    },
  },
  responsibleShort: {
    title: 'Responsable',
    type: 'text',
    sort: false,
  },
};
