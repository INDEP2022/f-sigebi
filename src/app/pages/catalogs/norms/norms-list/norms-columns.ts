import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const NORMS_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  norm: {
    title: 'Norma',
    type: 'string',
    sort: false,
  },
  article: {
    title: 'Artículo',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
  characteristics: {
    title: 'Características',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      value !== null ? (value = value) : (value = '');
      return value;
    },
  },
  merchandise: {
    title: 'Mercancías',
    type: 'string',
    sort: false,
  },
  fundament: {
    title: 'Fundamento',
    type: 'string',
    sort: false,
  },
  objective: {
    title: 'Objetivo',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Destino',
    type: 'string',
    sort: false,
  },
  condition: {
    title: 'Condición',
    type: 'string',
    sort: false,
  },
  userCreation: {
    title: 'Creado por',
    type: 'string',
    sort: false,
  },
  userModification: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },
};
