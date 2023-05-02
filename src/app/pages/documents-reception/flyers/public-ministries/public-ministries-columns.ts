import { ICity } from 'src/app/core/models/catalogs/city.model';

export const PUBLIC_MINISTRIES_COLUMNS = {
  idCity: {
    title: 'No.Ciudad',
    valuePrepareFunction: (value: ICity) => {
      return value != null ? value.idCity + ' - ' + value.nameCity : '-';
    },
    sort: false,
  },
  id: {
    title: 'No.Minpub',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    sort: false,
  },
};
