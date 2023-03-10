import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS = {
  goodId: {
    title: 'Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
  },
  amout: {
    title: 'Monto',
    sort: false,
  },
  identifier: {
    title: 'Identificador',
    sort: false,
  },
};

export const COLUMNS2 = {
  cveDocument: {
    title: 'Clave',
    sort: false,
  },
  description: {
    title: 'Documento',
    sort: false,
  },
};
