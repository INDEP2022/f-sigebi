import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';

export const COLUMNS = {
  goodId: {
    title: 'No.Bien',
    sort: false,
  },
  motive1: {
    title: 'Motivo 1',
    sort: false,
  },
  motive2: {
    title: 'Motivo 2',
    sort: false,
  },
  motive3: {
    title: 'Motivo 3',
    sort: false,
  },
  motive4: {
    title: 'Motivo 4',
    sort: false,
  },
  motive5: {
    title: 'Motivo 5',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IDelegation) => {
      return value?.description;
    },
  },
};
