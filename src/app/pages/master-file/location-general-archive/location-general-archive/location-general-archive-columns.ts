import { LocationGeneralRenderComponent } from './render-component/location-general-render/location-general-render.component';

export const ARCHIVE_GENERAL = {
  id: {
    title: 'Cve.',
    type: 'string',
    sort: false,
  },
  location: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  responsible: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },
};
//
export const ARCHIVE_BATTERY = {
  idBattery: {
    title: 'No.',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'custom',
    sort: false,
    filter: false,
    renderComponent: LocationGeneralRenderComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { value: cell, type: 'battery', rowData: row };
    },
  },
};
//
export const ARCHIVE_SHELF = {
  id: {
    title: 'No.',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'custom',
    sort: false,
    filter: false,
    renderComponent: LocationGeneralRenderComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { value: cell, type: 'battery', rowData: row };
    },
  },
};
//
export const ARCHIVE_SHELF_FOUR = {
  id: {
    title: 'No.',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'custom',
    sort: false,
    filter: false,
    renderComponent: LocationGeneralRenderComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { value: cell, type: 'battery', rowData: row };
    },
  },
};
//
export const ARCHIVE_FILES = {
  id: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
};
//
export const ARCHIVE_DOCUMENTS = {
  keyTypeDocument: {
    title: 'Tipo Documento',
    type: 'string',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción del Documento',
    type: 'string',
    sort: false,
  },
  userRequestsScan: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  dateReceivesFile: {
    title: 'Fecha Recepción',
    type: 'string',
    sort: false,
  },
  natureDocument: {
    title: 'Naturaleza',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'custom',
    sort: false,
    filter: false,
    renderComponent: LocationGeneralRenderComponent,
    valuePrepareFunction: (cell: any, row: any) => {
      return { value: cell, type: 'documents', rowData: row };
    },
  },
};
