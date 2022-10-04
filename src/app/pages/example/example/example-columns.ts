import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const EXAMPLE_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  reportName: {
    title: 'Nombre reporte',
    type: 'string',
    sort: false,
  },
  paragraph: {
    title: 'Párrafo',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
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
  version: {
    title: 'Version',
    type: 'number',
    sort: false,
  },
};
