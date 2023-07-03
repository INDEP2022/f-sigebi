export interface IDictation {
  id?: number;
  passOfficeArmy: string | null;
  expedientNumber: number;
  typeDict: string;
  statusDict: string | null;
  dictDate: Date | null;
  userDict: string;
  observations: string | null;
  delegationDictNumber: number | null;
  areaDict: number | null;
  instructorDate: Date | null;
  registerNumber: number | null;
  esDelit: string | null;
  wheelNumber: number | null;
  keyArmyNumber: number | null;
  notifyAssuranceDate: Date | null;
  resolutionDate: Date | null;
  notifyResolutionDate: Date | null;
  folioUniversal: number | null;
  entryDate: Date | null;
  dictHcDAte: Date | null;
  entryHcDate: Date | null;
}
export interface IDictationCopies {
  id?: number;
  numberOfDicta?: string;
  typeDictamination?: string;
  recipientCopy?: string;
  copyDestinationNumber?: number;
  personExtInt?: string;
  namePersonExt?: string;
  registerNumber?: number;
}

export interface IInitFormLegalOpinionOfficeBody {
  tipo: string;
  p_valor: number;
}
export interface IInitFormLegalOpinionOfficeResponse {
  identi: string;
  cve_acta: string;
  fecha: Date;
}
export interface ICopiesOfficeSendDictation {
  vc_pantalla: string;
  clave_oficio_armada: string;
  estatus_of: string;
  fec_dictaminacion: Date;
  tipo_dictaminacion: string;
  identi: string;
  no_volante: number;
  no_of_dicta: number;
  toolbar_no_delegacion: number;
  nom_dest: string;
  destinatario: string;
  no_clasif_bien?: number;
  no_bien?: number;
  no_departamento_destinatario: number;
  no_delegacion_destinatario: number;
  no_delegacion_dictam: number;
  tipo: string;
  usuario: string;
  ciudad: string;
  iden?: string;
  num_clave_armada: number;
  toolbar_no_departamento: number;
  toolbar_no_subdelegacion: number;
  estatus_dictaminacion: string;
  proceso_ext_dom?: string;
  paquete: number;
}
export interface ITmpDictationCreate {
  id: number;
  typeDict: string;
  keyOfficeArmA: string;
  statusOf: string;
}
export interface ITmpExpDesahogoB {
  goodNumber: number;
  numberProceedings: number;
}

export interface IUpdateDelDictation {
  ofDictaNumber?: number;
  delegationDictateNumber?: number;
}

export interface IPupLaunchReport {
  no_exp: number;
  correo: string;
  oficios: string;
}
export interface IStatusChange {
  procDocId: string;
  doc: string;
  bien: string;
  cveOfGestion: string;
  b: string;
  d: string;
  noOfGestion: number;
  seRefiereA: string;
  bienes: {
    no_bien: number;
    seleccion: boolean;
  };
  todos: boolean;
  usuario: string;
  pDictamen: number;
  noVolante: number;
}

export interface IPufGenerateKey {
  remit: string;
  pllamo: string;
}

export interface IPufGenerateKey_response {
  keyOfGestion: string;
}

export interface IGetSigned {
  dictanumber: string | number;
  typeruling: string;
  armedtradekey: string;
  proceedingsnumber: string | number;
  rulingdate: Date;
  steeringwheelnumber: string | number;
  sender: string;
  statusof: string;
  universalfolio: string | number;
  signature: string;
  typesteeringwheel: string;
}
