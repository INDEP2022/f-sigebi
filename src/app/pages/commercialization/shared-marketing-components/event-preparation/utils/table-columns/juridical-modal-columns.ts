import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const JURIDICAL_MODAL_COLUMNS = {
  key: {
    title: 'Abreviatura',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  legalDescription: {
    title: 'Jurídico',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  comerDescription: {
    title: 'Comercialización',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
};
