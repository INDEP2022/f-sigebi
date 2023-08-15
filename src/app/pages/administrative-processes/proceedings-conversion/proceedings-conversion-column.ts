import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { FieldToSearch } from '../../juridical-processes/shared/form-search-handler/form-search-handler.component';

export const RELATED_DOCUMENTS_COLUMNS_GOODS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  acta: {
    title: 'Acta',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.fileNumber.ac;
    },
  },

  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  desEstatus: {
    title: 'Des. Estatus',
    type: 'string',
    sort: false,
    hide: true,
  },
};
// Columnas de la tabla de documentos relacionados al volante y folio universal
export const RELATED_FOLIO_COLUMNS = {
  id: {
    title: 'Folio',
    sort: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción del documento',
    sort: false,
  },
};

function validationCheck(checked: boolean) {
  if (checked) {
  }
}

export interface IDataGoodsTable {
  goodId: number;
  description: string;
  quantity: number;
  identifier: string;
  status: string;
  desEstatus: string;
  seleccion: boolean;
  improcedente: boolean;
  disponible: boolean;
}

export const ACTAS_CONVERSION_SEARCH_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  expedientNumber: {
    title: 'No. Expediente.',
    type: 'string',
    sort: false,
  },
  officeExternalKey: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },
  cityNumber: {
    title: 'No. Ciudad',
    type: 'string',
    sort: false,
  },
  entFedKey: {
    title: 'No. Entidad Federativa',
    type: 'string',
    sort: false,
  },
  endTransferNumber: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
  },
  stationNumber: {
    title: 'No. Emisora',
    type: 'string',
    sort: false,
  },
  autorityNumber: {
    title: 'No. Autoridad',
    type: 'string',
    sort: false,
  },
  indiciadoNumber: {
    title: 'No. Indiciado',
    type: 'string',
    sort: false,
  },
  externalOfficeDate: {
    title: 'Fecha Oficio',
    type: 'number',
    sort: false,
  },
  circumstantialRecord: {
    title: 'Acta Circusnt.',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averig. Previa',
    type: 'number',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  protectionKey: {
    title: 'No. Amparo',
    type: 'number',
    sort: false,
  },
  touchPenaltyKey: {
    title: 'Toca Penal',
    type: 'string',
    sort: false,
  },
  expedientTransferenceNumber: {
    title: 'Exp. Transferente',
    type: 'string',
    sort: false,
  },
};

export const ACTAS_CONVERSION: FieldToSearch[] = [
  {
    field: 'wheelNumber',
  },
  {
    field: 'expedientNumber',
  },
  {
    field: 'officeExternalKey',
  },
  {
    field: 'expedientTransferenceNumber',
  },
  {
    field: 'judgementType',
  },
  {
    field: 'circumstantialRecord',
  },
  {
    field: 'preliminaryInquiry',
  },
  {
    field: 'criminalCase',
  },
  {
    field: 'protectionKey',
  },
  {
    field: 'touchPenaltyKey',
  },
  {
    field: 'wheelType',
  },
  {
    field: 'affairKey',
    nestedObjField: 'id',
  },
  {
    field: 'dictumKey',
    nestedObjField: 'id',
  },
  {
    field: 'cityNumber',
    nestedObjField: 'idCity',
  },
  {
    field: 'entFedKey',
    nestedObjField: 'otKey',
  },
  {
    field: 'endTransferNumber',
    nestedObjField: 'id',
  },
  {
    field: 'stationNumber',
    nestedObjField: 'id',
  },
  {
    field: 'autorityNumber',
    nestedObjField: 'idAuthority',
  },
  {
    field: 'indiciadoNumber',
    nestedObjField: 'id',
  },
  {
    field: 'crimeKey',
    nestedObjField: 'otKey',
  },
  {
    field: 'viaKey',
    nestedObjField: 'otKey',
  },
  {
    field: 'institutionNumber',
    nestedObjField: 'id',
  },
];

export const JURIDICAL_FILE_UPDATE_FLYER_COPIES_COLUMNS = {
  copyuser: {
    title: 'Usuario',
    type: 'number',
    sort: false,
  },
  userDetail: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.name;
    },
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
};

export const JURIDICAL_FILE_UPDATE_SHIFT_CHANGE_COLUMNS = {
  flyerNumber: {
    title: 'Usuario',
    type: 'number',
    sort: false,
  },
  userDetail: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.name;
    },
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
};

export const COUNT_ACTAS_COLUMNS = {
  id: {
    title: 'No. Conversión',
    type: 'number',
    sort: false,
  },
  fileNumber: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  goodFatherNumber: {
    title: 'No. Bien Padre',
    type: 'number',
    sort: false,
  },
  cveActaConv: {
    title: 'Clave Acta',
    type: 'number',
    sort: false,
  },
  witnessOic: {
    title: 'Testigo de la Contraloría',
    type: 'number',
    sort: false,
  },
};

export interface MassiveChargeGoodsDto {
  id: number;
  goodNumber: number;
  fileNumber: number;
  flyerNumber: number;
  user: string;
  massiveChargeDate: string;
  daydayEviction: number;
}
export interface GooByExpediente {
  goodId: number;
  description: string;
  quantity: number;
  identifier: string;
  status: string;
  desEstatus: string;
  seleccion: boolean;
  improcedente: boolean;
  disponible: boolean;
  acta: IExpedient;
}
