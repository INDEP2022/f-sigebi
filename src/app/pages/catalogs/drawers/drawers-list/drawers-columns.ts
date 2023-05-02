import { ISafe } from 'src/app/core/models/catalogs/safe.model';

export const DRAWERS_COLUMNS = {
  noDrawer: {
    title: 'Registro',
    type: 'string',
    sort: false,
  },

  noBobeda: {
    title: 'Boveda',
    type: 'string',
    valuePrepareFunction: (boveda: ISafe) => {
      return boveda?.description;
    },
    sort: false,
  },

  status: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },

  noRegistration: {
    title: 'No. registro',
    type: 'string',
    sort: false,
  },
};
