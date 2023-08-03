import { AssociateFieldComponent } from './actions/associate-field/associate-field.component';

export const EXPEDIENT_DOC_GEN_COLUMNS = {
  associate: {
    defaultValue: 'Asociar a Expediente',
    title: 'Asociar',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: AssociateFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },

  id: {
    title: 'No. Solicitud',
    type: 'text',
    sort: false,
  },

  recordId: {
    title: 'No. Expediente',
    type: 'text',
    sort: false,
  },

  applicationDate: {
    title: 'Fecha de Solicitud',
    type: 'date',
    sort: false,
  },

  paperDate: {
    title: 'Fecha de Oficio',
    type: 'text',
    sort: false,
  },

  nameOfOwner: {
    title: 'Nombre del Remitente',
    type: 'text',
    sort: false,
  },

  holderCharge: {
    title: 'Cargo del Remitente',
    type: 'text',
    sort: false,
  },

  phoneOfOwner: {
    title: 'Teléfono del Remitente',
    type: 'text',
    sort: false,
  },

  emailOfOwner: {
    title: 'Email del Remitente',
    type: 'text',
    sort: false,
  },

  regionalDelegationName: {
    title: 'Delegación Regional',
    type: 'string',
    sort: false,
  },

  stateName: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },

  transferentName: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },

  stationName: {
    title: 'Emisora',
    type: 'string',
    sort: false,
  },

  authorityName: {
    title: 'Autoridad',
    type: 'string',
    sort: false,
  },

  sender: {
    title: 'Remitente',
    type: 'string',
    sort: false,
  },

  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },

  indicatedTaxpayer: {
    title: 'Contribuyente y/o Indiciado',
    type: 'string',
    sort: false,
  },

  transferFile: {
    title: 'Expediente Transferente/PAMA',
    type: 'string',
    sort: false,
  },

  circumstantialRecord: {
    title: 'Acta Circunstanciada',
    type: 'string',
    sort: false,
  },

  previousInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },

  lawsuit: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },

  protectNumber: {
    title: 'No. Amparo',
    type: 'string',
    sort: false,
  },

  tocaPenal: {
    title: 'Toca Penal',
    type: 'string',
    sort: false,
  },

  paperNumber: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },

  indicated: {
    title: 'Indiciado',
    type: 'string',
    sort: false,
  },

  publicMinistry: {
    title: 'Ministerio Público',
    type: 'string',
    sort: false,
  },

  judged: {
    title: 'Juzgado',
    type: 'string',
    sort: false,
  },

  crime: {
    title: 'Delito',
    type: 'string',
    sort: false,
  },

  receiptRoute: {
    title: 'Vía de Recepción',
    type: 'string',
    sort: false,
  },

  affair: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },

  typeRecord: {
    title: 'Tipo Expediente',
    type: 'string',
    sort: false,
  },
};

export const EXPEDIENT_DOC_REQ_COLUMNS = {
  associate: {
    defaultValue: 'Ver Bienes',
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: AssociateFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  id: {
    title: 'No. Solicitud',
    type: 'text',
    sort: false,
  },

  recordId: {
    title: 'No. Expediente',
    type: 'text',
    sort: false,
  },

  applicationDate: {
    title: 'Fecha de Solicitud',
    type: 'text',
    sort: false,
  },

  paperDate: {
    title: 'Fecha de Oficio',
    type: 'text',
    sort: false,
  },

  nameOfOwner: {
    title: 'Nombre del Remitente',
    type: 'text',
    sort: false,
  },

  holderCharge: {
    title: 'Cargo del Remitente',
    type: 'text',
    sort: false,
  },

  phoneOfOwner: {
    title: 'Teléfono del Remitente',
    type: 'text',
    sort: false,
  },

  emailOfOwner: {
    title: 'Email del Remitente',
    type: 'text',
    sort: false,
  },

  regionalDelegationName: {
    title: 'Delegación Regional',
    type: 'string',
    sort: false,
  },

  stateName: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },

  transferentName: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },

  stationName: {
    title: 'Emisora',
    type: 'string',
    sort: false,
  },

  authorityName: {
    title: 'Autoridad',
    type: 'string',
    sort: false,
  },

  sender: {
    title: 'Remitente',
    type: 'string',
    sort: false,
  },

  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },

  targetUser: {
    title: 'Usuario Destino',
    type: 'string',
    sort: false,
  },

  indicatedTaxpayer: {
    title: 'Contribuyente y/o Indiciado',
    type: 'string',
    sort: false,
  },

  transferenceFile: {
    title: 'Expediente Transferente/PAMA',
    type: 'string',
    sort: false,
  },

  transferEntNotes: {
    title: 'Notas Entidad Transferente',
    type: 'string',
    sort: false,
  },

  addressId: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },

  originInfo: {
    title: 'Procedencia Información',
    type: 'string',
    sort: false,
  },

  circumstantialRecord: {
    title: 'Acta Circunstanciada',
    type: 'string',
    sort: false,
  },

  previousInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },

  lawsuit: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },

  protectNumber: {
    title: 'No. Amparo',
    type: 'string',
    sort: false,
  },

  tocaPenal: {
    title: 'Toca Penal',
    type: 'string',
    sort: false,
  },

  paperNumber: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },

  indicated: {
    title: 'Indiciado',
    type: 'string',
    sort: false,
  },

  publicMinistry: {
    title: 'Ministerio Público',
    type: 'string',
    sort: false,
  },

  court: {
    title: 'Juzgado',
    type: 'string',
    sort: false,
  },

  crime: {
    title: 'Delito',
    type: 'string',
    sort: false,
  },

  receiptRoute: {
    title: 'Vía de Recepción',
    type: 'string',
    sort: false,
  },

  destinationManagement: {
    title: 'Gestión de Destino',
    type: 'string',
    sort: false,
  },

  affair: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },

  typeRecord: {
    title: 'Tipo Expediente',
    type: 'string',
    sort: false,
  },
  municipalityName: {
    title: 'Municipio',
    type: 'string',
    sort: false,
  },

  location: {
    title: 'Localidad',
    type: 'string',
    sort: false,
  },

  exteriorNumber: {
    title: 'No. Ext.',
    type: 'number',
    sort: false,
  },

  interiorNumber: {
    title: 'No. Interior',
    type: 'number',
    sort: false,
  },

  code: {
    title: 'C.P.',
    type: 'number',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  latitude: {
    title: 'Latitud',
    type: 'string',
    sort: false,
  },

  length: {
    title: 'Longitud',
    type: 'string',
    sort: false,
  },
};

export const EXPEDIENT_DOC_EST_COLUMNS = {
  goodId: {
    title: 'Número de Gestión',
    type: 'number',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave Única',
    type: 'number',
    sort: false,
  },

  fileNumber: {
    title: 'No. Expediente de la Transferente',
    type: 'string',
    sort: false,
  },

  requestId: {
    title: 'No. Solicitud',
    type: 'number',
    sort: false,
  },

  goodDescription: {
    title: 'Descripción de Bien Transferente',
    type: 'string',
    sort: false,
  },

  message: {
    title: 'Mensaje',
    type: 'string',
    sort: false,
  },

  physicalStatusName: {
    title: 'Estado Físico',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad de la Transferente',
    type: 'string',
    sort: false,
  },

  destinyName: {
    title: 'Destino Ligie',
    type: 'string',
    sort: false,
  },

  fractionName: {
    title: 'Fracción',
    type: 'string',
    sort: false,
  },
};

export const EXPEDIENT_DOC_SEA_COLUMNS = {
  dDocName: {
    title: 'Nom. Documento',
    type: 'string',
    sort: false,
  },

  xidExpediente: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },

  xidSolicitud: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },

  xtipoDocumentoNombre: {
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
    title: 'Fecha de Creación',
    type: 'string',
    sort: false,
  },
};
