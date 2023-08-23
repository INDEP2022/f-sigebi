import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const HELP_SCREEN_COLUMNS = {
  businessRoleNumber: {
    title: 'Número',
    sort: false,
  },
  businessRoleDesc: {
    title: 'Descripción',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
};
