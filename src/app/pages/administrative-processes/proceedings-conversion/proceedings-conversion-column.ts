import { CheckboxImprocedentElementComponent } from '../../documents-reception/flyers/related-documents/checkbox-improcedent/checkbox-improcedent-element';
import { CheckboxSelectElementComponent } from '../../documents-reception/flyers/related-documents/checkbox-improcedent/checkbox-select-element';
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
  identifier: {
    title: 'Ident.',
    type: 'string',
    sort: false,
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
  seleccion: {
    title: 'Selección',
    type: 'custom',
    renderComponent: CheckboxSelectElementComponent, //CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
    hide: false,
  },
  improcedente: {
    title: 'Improcedente',
    type: 'custom',
    renderComponent: CheckboxImprocedentElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
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
    title: 'Exp. Transfer',
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
  idConversion: {
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
    title: 'CVE Acta',
    type: 'number',
    sort: false,
  },
  witnessOic: {
    title: 'Testigo de la Contraloria',
    type: 'number',
    sort: false,
  },
};
