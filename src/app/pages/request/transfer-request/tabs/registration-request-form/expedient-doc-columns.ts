import { AssociateFieldComponent } from './actions/associate-field/associate-field.component';

export const EXPEDIENT_DOC_GEN_COLUMNS = {
  associate: {
    title: 'Asociar',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: AssociateFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },

  id: {
    title: 'No°. solicitud',
    type: 'text',
    sort: false,
  },

  recordId: {
    title: 'No°. expediente',
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
    title: 'Delegación regional',
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
    title: 'No° amparo',
    type: 'string',
    sort: false,
  },

  tocaPenal: {
    title: 'Toca penal',
    type: 'string',
    sort: false,
  },

  paperNumber: {
    title: 'No° oficio',
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
  requestNumber: {
    title: 'No°. solicitud',
    type: 'text',
    sort: false,
  },

  expedientNumber: {
    title: 'No°. expediente',
    type: 'text',
    sort: false,
  },

  applicationDate: {
    title: 'Fecha de solicitud',
    type: 'text',
    sort: false,
  },

  officialDate: {
    title: 'Fecha de oficio',
    type: 'text',
    sort: false,
  },

  sendersName: {
    title: 'Nombre del remitente',
    type: 'text',
    sort: false,
  },

  sendersCharge: {
    title: 'Cargo del remitente',
    type: 'text',
    sort: false,
  },

  sendersPhone: {
    title: 'Telefono del remitente',
    type: 'text',
    sort: false,
  },

  sendersEmail: {
    title: 'Email del remitente',
    type: 'text',
    sort: false,
  },

  regionalDelegation: {
    title: 'Delegación regional',
    type: 'string',
    sort: false,
  },

  state: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },

  transferent: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },

  station: {
    title: 'Emisora',
    type: 'string',
    sort: false,
  },

  authority: {
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

  transferFile: {
    title: 'Expediente transferente/PAMA',
    type: 'string',
    sort: false,
  },

  transferEntityNotes: {
    title: 'Notas entidad transferente',
    type: 'string',
    sort: false,
  },

  idDirection: {
    title: 'idDireccion',
    type: 'string',
    sort: false,
  },

  provenanceInformation: {
    title: 'Procedencia información',
    type: 'string',
    sort: false,
  },

  circumstantialRecord: {
    title: 'Acta circunstanciada',
    type: 'string',
    sort: false,
  },

  preliminaryInquiry: {
    title: 'Averiguación previa',
    type: 'string',
    sort: false,
  },

  causePenal: {
    title: 'Causa penal',
    type: 'string',
    sort: false,
  },

  protectionNumber: {
    title: 'No° amparo',
    type: 'string',
    sort: false,
  },

  perfomPenal: {
    title: 'Toca penal',
    type: 'string',
    sort: false,
  },

  officeNumber: {
    title: 'No° oficio',
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

  receivingPath: {
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

  typeExpedient: {
    title: 'Tipo expediente',
    type: 'string',
    sort: false,
  },
  municipality: {
    title: 'Municipio',
    type: 'string',
    sort: false,
  },

  location: {
    title: 'Localidad',
    type: 'string',
    sort: false,
  },

  outdoorNumber: {
    title: 'Num. Ext.',
    type: 'number',
    sort: false,
  },

  interiorNumber: {
    title: 'Número interior',
    type: 'number',
    sort: false,
  },

  postalCode: {
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
  numberGestion: {
    title: 'Número de gestión',
    type: 'number',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave Única',
    type: 'number',
    sort: false,
  },

  numExpTransferent: {
    title: 'No°. expediente de la transferente',
    type: 'string',
    sort: false,
  },

  numberRequest: {
    title: 'No°. solicitud',
    type: 'number',
    sort: false,
  },

  descriptionTransferent: {
    title: 'Descripción de bien transferente',
    type: 'string',
    sort: false,
  },

  message: {
    title: 'Mensaje',
    type: 'string',
    sort: false,
  },

  conditionPhysical: {
    title: 'Estado fisico',
    type: 'string',
    sort: false,
  },

  transerUnit: {
    title: 'Unidad de medida transferente',
    type: 'string',
    sort: false,
  },

  quantityTransferent: {
    title: 'Cantidad de la transferente',
    type: 'string',
    sort: false,
  },

  destinityLigie: {
    title: 'Destino ligie',
    type: 'string',
    sort: false,
  },

  fraction: {
    title: 'Fracción',
    type: 'string',
    sort: false,
  },
};

export const EXPEDIENT_DOC_SEA_COLUMNS = {
  noDocument: {
    title: 'No°. documento',
    type: 'string',
    sort: false,
  },

  noExpedient: {
    title: 'No°. expediente',
    type: 'string',
    sort: false,
  },

  noRequest: {
    title: 'No°. solicitud',
    type: 'string',
    sort: false,
  },

  titleDocument: {
    title: 'Titulo del documento',
    type: 'string',
    sort: false,
  },

  typeDocument: {
    title: 'Tipo de documento',
    type: 'string',
    sort: false,
  },

  author: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },

  createDate: {
    title: 'Fecha de creación',
    type: 'string',
    sort: false,
  },
};
