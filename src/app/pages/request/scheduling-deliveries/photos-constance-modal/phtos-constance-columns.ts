import { DatePipe } from '@angular/common';

export const PHOTOS_TABLE_COLUMNS = {
  dDocName: {
    title: 'No. Fotografía',
    type: 'string',
    sort: false,
  },
  xidBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  xtipoDocumento: {
    title: 'Tipo de Documento',
    type: 'string',
    sort: false,
  },
  ddocTitle: {
    title: 'Título del Documento',
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
  xNoProgramacion: {
    title: 'No. Programación',
    type: 'string',
    sort: false,
  },
  xFolioProgramacion: {
    title: 'Folio Programación',
    type: 'string',
    sort: false,
  },
  /*actions: {
    title: 'Acciones',
    type: 'custom',
    class: 'open-photos',
    filter: false,
    renderComponent: SeePhotoComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },*/
};
