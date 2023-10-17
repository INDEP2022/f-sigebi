import { BtnRequestComponent } from '../../../../shared-request/expedients-tabs/sub-tabs/btn-request/btn-request.component';

export const LIST_EXPEDIENTS_COLUMN = {
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
  xidExpediente: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },
  typeDescription: {
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
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  xversion: {
    title: 'Version',
    type: 'string',
    sort: false,
  },
  button: {
    title: 'Acciones',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: BtnRequestComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
