import { BtnRequestComponent } from '../../../../shared-request/expedients-tabs/sub-tabs/btn-request/btn-request.component';

export const LIST_EXPEDIENTS_COLUMN = {
  noDoc: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  noAsset: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  titleDocument: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },
  typeDocument: {
    title: 'Tipo de Documento',
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
