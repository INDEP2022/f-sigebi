import { BtnRequestComponent } from '../btn-request/btn-request.component';

export const DOC_REQUEST_TAB_COLUMNS = {
  dDocName: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  xidSolicitud: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Titulo del Documento',
    type: 'string',
    sort: false,
  },

  xtipoDocumento: {
    title: 'Tipo de Documento',
    type: 'string',
    sort: false,
  },
  dDocAuthor: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },

  dInDate: {
    title: 'Fecha Creada',
    type: 'string',
    sort: false,
  },
  button: {
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: BtnRequestComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
