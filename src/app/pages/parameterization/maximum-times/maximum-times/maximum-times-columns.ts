import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { IUsers } from 'src/app/core/models/catalogs/maximum-times-model';

export const MAXIMUM_TIMES_COLUMNS = {
  certificateType: {
    title: 'Tipo de Acta',
    sort: false,
  },
  date: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (text: string) => {
      if (text) {
        const parts = text.split('T')[0].split('-');
        if (parts.length === 3) {
          return parts.reverse().join('/');
        }
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  tmpMax: {
    title: 'Tiempo Máximo',
    sort: false,
  },
  activated: {
    title: 'Activado',
    sort: false,
  },
  user: {
    title: 'Usuario',
    valuePrepareFunction: (value: IUsers) => {
      return value != null ? value.name : '-';
    },
    sort: false,
  },
};
