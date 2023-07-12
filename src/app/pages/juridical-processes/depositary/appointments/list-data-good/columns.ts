import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_DATA = {
  goodId: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  goodClassNumber: {
    title: 'No. Clasificador Bien',
    sort: false,
  },
};
