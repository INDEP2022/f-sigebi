import { BtnRequestComponent } from '../../../../shared-request/expedients-tabs/sub-tabs/btn-request/btn-request.component';

export const LIST_EXPEDIENTS_COLUMN = {
  dDocName: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  xidBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  ddocTitle: {
    title: 'Título del Documento',
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
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  version: {
    title: 'Version',
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
