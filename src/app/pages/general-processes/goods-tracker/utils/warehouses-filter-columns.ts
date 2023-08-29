import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const WAREHOUSES_FILTER_COLUMNS = {
  description: {
    title: 'Almacén',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  ubication: {
    title: 'Ubicación',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
};
