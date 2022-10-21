import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS = {
  goodId: {
    title: 'No.Bien',
    sort: false,
  },
  satUniqueKey: {
    title: 'Clave Única',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  classification: {
    title: 'Clasificador',
    sort: false,
  },
};
