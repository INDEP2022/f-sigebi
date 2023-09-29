import { ComponentRenderDocumentSentComponent } from './render-component/component-render-document-sent/component-render-document-sent.component';

export const DOCUMENTS_SENT_COLUMNS = {
  id: {
    title: 'Exp.',
    type: 'string',
    sort: false,
  },
  areaSends: {
    title: 'Area Envía',
    type: 'string',
    sort: false,
  },
  userRequestsScan: {
    title: 'Usuario Solicita Escaneo',
    type: 'string',
    sort: false,
  },
  keyTypeDocument: {
    title: 'Tipo de documento',
    type: 'string',
    sort: false,
  },
  diDocument: {
    title: 'Documento',
    type: 'string',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  natureDocument: {
    title: 'Natural',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'custom',
    sort: false,
    filter: false,
    renderComponent: ComponentRenderDocumentSentComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { value: cell, type: '', rowData: row };
    },
  },
};
