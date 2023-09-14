import { DatePipe } from '@angular/common';
import { SeePhotoComponent } from '../actions/see-photo/see-photo.component';

export const PHOTOS_TABLE_COLUMNS = {
  dDocName: {
    title: 'No. Fotografía',
    type: 'string',
    sort: false,
  },
  ddocTitle: {
    title: 'Título del Documento',
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
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  xidBien: {
    title: 'No. Gestión',
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
