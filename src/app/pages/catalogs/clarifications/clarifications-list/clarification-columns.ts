import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const CLARIFICATION_COLUMNS = {
  id: {
    title: 'Identificador',
    type: 'number',
    sort: false,
  },
  clarification: {
    title: 'Aclaración',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'number',
    sort: false,
  },
  creationUser: {
    title: 'Creado por',
    type: 'string',
    sort: false,
  },
  editionUser: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },
  version: {
    title: 'Version',
    type: 'number',
    sort: false,
  },
  active: {
    title: 'Activo',
    type: 'number',
    sort: false,
  },
};
