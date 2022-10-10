import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';

export const DEPARTMENT_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },

  dsarea: {
    title: 'DsArea',
    type: 'string',
    sort: false,
  },
  numDelegation: {
    title: 'Delegación',
    type: 'string',
    valuePrepareFunction: (value: IDelegation) => {
      return value?.description;
    },
    sort: false,
  },
  numSubDelegation: {
    title: 'Subdelegación',
    type: 'string',
    valuePrepareFunction: (value: ISubdelegation) => {
      return value?.description;
    },
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  numRegister: {
    title: 'N registro',
    type: 'number',
    sort: false,
  },
  lastOffice: {
    title: 'Oficio',
    type: 'number',
    sort: false,
  },
  level: {
    title: 'Nivel',
    type: 'number',
    sort: false,
  },
  phaseEdo: {
    title: 'Etapa EDO',
    type: 'number',
    sort: false,
  },
};
