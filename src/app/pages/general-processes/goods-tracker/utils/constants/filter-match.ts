import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const FilterMatchTracker: any = {
  satDepartureNum: null,
  clasifNum: 'clasif',
  alternativeClasifNum: null,
  types: 'clasif',
  subtypes: 'clasif',
  ssubtypes: 'clasif',
  sssubtypes: 'clasif',
  goodNum: 'goodNumber',
  process: 'extDomProcess',
  samiInventory: null,
  targetIdentifier: 'destiny',
  status: 'goodStatus',
  withPhoto: 'photography',
  menageFather: 'parentGoodMenajeNumber',
  valueFrom: 'appraisalValue',
  valueTo: 'appraisalValue',
  photoDate: 'photoDate',
  identifier: 'identificator',
  description: 'goodDescription',
  attributes: 'parval',
  movableIventory: null,
  siabiInventory: 'inventorySiabiId',
  cisiInventory: 'propertyCisiId',
  expedientNum: 'file',
  flyerNum: 'file',
  judgeNum: 'file',
  trasnferExp: null,
  flyerType: 'file',
  officeDate: 'file',
  protection: 'file',
  indicatedName: null,
  publicMin: 'file',
  criminalCase: 'file',
  extOfficeNum: null,
  previusInvestigation: null,
  dictum: null,
  criminalCause: null,
  receptionForm: 'dateReceptionPhisical',
  receptionTo: 'dateReceptionPhisical',
  certificate: 'keyDestMinutes',
  receptionStatus: 'goodNumber',
  statusChangeFrom: null,
  statusChaangeTo: null,
  eventNum: null,
  historicalProcess: null,
  transfers: 'transfereeNumber',
  transmitters: 'emitter',
  autorities: 'authority',
  warehouse: 'warehouseNumber',
  cordination: 'adminCoordNumber',
  autorityState: 'stageState',
  goodState: 'warehosueState',
};

export const OperatorValues: any = {
  valueFrom: SearchFilter.GTE,
  valueTo: SearchFilter.LTE,
  receptionForm: SearchFilter.GTE,
  receptionTo: SearchFilter.GTE,
  description: SearchFilter.ILIKE,
  attributes: SearchFilter.ILIKE,
  publicMin: SearchFilter.IN,
  flyerNum: SearchFilter.IN,
  judgeNum: SearchFilter.IN,
  flyerType: SearchFilter.IN,
  officeDate: SearchFilter.IN,
  protection: SearchFilter.IN,
  receptionStatus: SearchFilter.IN,
};

export let TYPES_CLASIF: any[] = [];
export let SUBTYPES_CLASIF: any[] = [];
export let SSSUBTYPES_CLASIF: any = [];
export let FLYER: any[] = [];
export let COURTS: any[] = [];
export let FLYER_TYPE: any[] = [];
export let EXTERNAL_OFFICE_DATE: any[] = [];
export let PROTECTIONS: any[] = [];
export let MINPUBS: any[] = [];
export let EXTERNAL_OFFICE: any[] = [];
export let CRIMINAL_CASE: any[] = [];
export let RECEPTION_STATUS: any[] = [];
export const TrackerValues: any = {
  types: TYPES_CLASIF,
  subtypes: SUBTYPES_CLASIF,
  ssubtypes: SSSUBTYPES_CLASIF,
  flyerNum: FLYER,
  judgeNum: COURTS,
  flyerType: FLYER_TYPE,
  officeDate: EXTERNAL_OFFICE_DATE,
  protection: PROTECTIONS,
  publicMin: MINPUBS,
  extOfficeNum: EXTERNAL_OFFICE,
  criminalCase: CRIMINAL_CASE,
  receptionStatus: RECEPTION_STATUS,
};
