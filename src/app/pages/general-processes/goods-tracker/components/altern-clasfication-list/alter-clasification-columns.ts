import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const ALTERN_CLASIFICATION_COLUMS = {
  id: {
    title: 'No. Clasificación Alterna',
    sort: false,
    filter: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
};
