import { VerImagenInputComponent } from '../../ver-imagen-input/ver-imagen-input.component';

export const LIST_IMAGES_COLUMNS = {
  NoManagement: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  noAssets: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  typeDocument: {
    title: 'Tipo Documento',
    type: 'string',
    sort: false,
  },
  titleDocument: {
    title: 'Título Documento',
    type: 'string',
    sort: false,
  },
  author: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  noProgramming: {
    title: 'No. Programación',
    type: 'string',
    sort: false,
  },
  folioProgramming: {
    title: 'Folio Programación',
    type: 'string',
    sort: false,
  },
  button: {
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: VerImagenInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
