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
    title: 'No. solicitud',
    type: 'text',
    sort: false,
  },

  recordId: {
    title: 'No. expediente',
    type: 'text',
    sort: false,
  },

  applicationDate: {
    title: 'Fecha de solicitud',
    type: 'date',
    sort: false,
  },

  paperDate: {
    title: 'Fecha de oficio',
    type: 'text',
    sort: false,
  },

  nameOfOwner: {
    title: 'Nombre del remitente',
    type: 'text',
    sort: false,
  },

  holderCharge: {
    title: 'Cargo del remitente',
    type: 'text',
    sort: false,
  },

  phoneOfOwner: {
    title: 'Telefono del remitente',
    type: 'text',
    sort: false,
  },

  emailOfOwner: {
    title: 'Email del remitente',
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
    title: 'Contribuyente y/o indiciado',
    type: 'string',
    sort: false,
  },

  transferFile: {
    title: 'Expediente transferente/PAMA',
    type: 'string',
    sort: false,
  },

  circumstantialRecord: {
    title: 'Acta circunstanciada',
    type: 'string',
    sort: false,
  },

  previousInquiry: {
    title: 'Averiguación previa',
    type: 'string',
    sort: false,
  },

  lawsuit: {
    title: 'Causa penal',
    type: 'string',
    sort: false,
  },

  protectNumber: {
    title: 'No amparo',
    type: 'string',
    sort: false,
  },

  tocaPenal: {
    title: 'Toca penal',
    type: 'string',
    sort: false,
  },

  paperNumber: {
    title: 'No oficio',
    type: 'string',
    sort: false,
  },

  indicated: {
    title: 'Indiciado',
    type: 'string',
    sort: false,
  },

  publicMinistry: {
    title: 'Ministerio publico',
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
    title: 'Vía de recepción',
    type: 'string',
    sort: false,
  },

  affair: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },

  typeRecord: {
    title: 'Tipo expediente',
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
    title: 'No. solicitud',
    type: 'text',
    sort: false,
  },

  recordId: {
    title: 'No. expediente',
    type: 'text',
    sort: false,
  },

  applicationDate: {
    title: 'Fecha de solicitud',
    type: 'text',
    sort: false,
  },

  paperDate: {
    title: 'Fecha de oficio',
    type: 'text',
    sort: false,
  },

  nameOfOwner: {
    title: 'Nombre del remitente',
    type: 'text',
    sort: false,
  },

  holderCharge: {
    title: 'Cargo del remitente',
    type: 'text',
    sort: false,
  },

  phoneOfOwner: {
    title: 'Telefono del remitente',
    type: 'text',
    sort: false,
  },

  emailOfOwner: {
    title: 'Email del remitente',
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
    title: 'Usuario destino',
    type: 'string',
    sort: false,
  },

  indicatedTaxpayer: {
    title: 'Contribuyente y/o indiciado',
    type: 'string',
    sort: false,
  },

  transferenceFile: {
    title: 'Expediente transferente/PAMA',
    type: 'string',
    sort: false,
  },

  transferEntNotes: {
    title: 'Notas entidad transferente',
    type: 'string',
    sort: false,
  },

  addressId: {
    title: 'idDireccion',
    type: 'string',
    sort: false,
  },

  originInfo: {
    title: 'Procedencia información',
    type: 'string',
    sort: false,
  },

  circumstantialRecord: {
    title: 'Acta circunstanciada',
    type: 'string',
    sort: false,
  },

  previousInquiry: {
    title: 'Averiguación previa',
    type: 'string',
    sort: false,
  },

  lawsuit: {
    title: 'Causa penal',
    type: 'string',
    sort: false,
  },

  protectNumber: {
    title: 'No amparo',
    type: 'string',
    sort: false,
  },

  tocaPenal: {
    title: 'Toca penal',
    type: 'string',
    sort: false,
  },

  paperNumber: {
    title: 'No oficio',
    type: 'string',
    sort: false,
  },

  indicated: {
    title: 'Indiciado',
    type: 'string',
    sort: false,
  },

  publicMinistry: {
    title: 'Ministerio publico',
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
    title: 'Vía de recepción',
    type: 'string',
    sort: false,
  },

  destinationManagement: {
    title: 'Gestión de destino',
    type: 'string',
    sort: false,
  },

  affair: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },

  typeRecord: {
    title: 'Tipo expediente',
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
    title: 'Num. Ext.',
    type: 'number',
    sort: false,
  },

  interiorNumber: {
    title: 'Número interior',
    type: 'number',
    sort: false,
  },

  code: {
    title: 'C.P',
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
    title: 'Número de gestión',
    type: 'number',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave Única',
    type: 'number',
    sort: false,
  },

  fileNumber: {
    title: 'No. expediente de la transferente',
    type: 'string',
    sort: false,
  },

  requestId: {
    title: 'No. solicitud',
    type: 'number',
    sort: false,
  },

  goodDescription: {
    title: 'Descripción de bien transferente',
    type: 'string',
    sort: false,
  },

  message: {
    title: 'Mensaje',
    type: 'string',
    sort: false,
  },

  physicalStatusName: {
    title: 'Estado fisico',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad de medida transferente',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad de la transferente',
    type: 'string',
    sort: false,
  },

  destinyName: {
    title: 'Destino ligie',
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
    title: 'Nom. documento',
    type: 'string',
    sort: false,
  },

  xidExpediente: {
    title: 'No. expediente',
    type: 'string',
    sort: false,
  },

  xidSolicitud: {
    title: 'No. solicitud',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Título del documento',
    type: 'string',
    sort: false,
  },

  xtipoDocumentoNombre: {
    title: 'Tipo de documento',
    type: 'string',
    sort: false,
  },

  dDocAuthor: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },

  dInDate: {
    title: 'Fecha de creación',
    type: 'string',
    sort: false,
  },
};
