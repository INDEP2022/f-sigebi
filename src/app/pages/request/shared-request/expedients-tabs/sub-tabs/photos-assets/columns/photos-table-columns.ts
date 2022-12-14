import { SeePhotoComponent } from '../actions/see-photo/see-photo.component';

export const PHOTOS_TABLE_COLUMNS = {
  noPhoto: {
    title: 'No. Fotografia',
    type: 'string',
    sort: false,
  },
  documentTitle: {
    title: 'Titulo del Documento',
    type: 'string',
    sort: false,
  },
  author: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  creationDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  noManagement: {
    title: 'No. Gestion',
    type: 'string',
    sort: false,
  },
  actions: {
    title: 'Actions',
    type: 'custom',
    class: 'open-photos',
    filter: false,
    renderComponent: SeePhotoComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
