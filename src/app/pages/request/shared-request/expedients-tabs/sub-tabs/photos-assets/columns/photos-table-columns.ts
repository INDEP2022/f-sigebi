import { SeePhotoComponent } from '../actions/see-photo/see-photo.component';

export const PHOTOS_TABLE_COLUMNS = {
  dDocName: {
    title: 'No. Fotografia',
    type: 'string',
    sort: false,
  },
  ddocTitle: {
    title: 'Titulo del Documento',
    type: 'string',
    sort: false,
  },
  dDocAuthor: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  dInDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  xidBien: {
    title: 'No. Gestion',
    type: 'string',
    sort: false,
  },
  actions: {
    title: 'Acciones',
    type: 'custom',
    class: 'open-photos',
    filter: false,
    renderComponent: SeePhotoComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
