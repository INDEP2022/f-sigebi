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
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'S')
        return '<strong><span class="badge badge-pill badge-success">Sí</span></strong>';
      if (value == 'N')
        return '<strong><span class="badge badge-pill badge-success">No</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'Sí' },
          { value: 'N', title: 'No' },
        ],
      },
    },
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
