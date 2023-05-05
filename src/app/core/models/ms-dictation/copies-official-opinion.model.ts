export interface ICopiesOfficialOpinion {
  id?: number | string;
  numberOfDicta: number;
  typeDictamination: string;
  recipientCopy: string;
  copyDestinationNumber: number;
  personExtInt: string;
  namePersonExt: string;
  registerNumber?: number;
  rullings?: IRullings;
}

export interface IRullings {
  numberOfDicta: number;
  typeDictamination: string;
  keyOfficeArmed: string;
  fileNumber: number;
  rulingStatus: string;
  dateRuling: string;
  userDictates: string;
  observations: null;
  delegationDictamNumber: number;
  areaDictamine: string;
  instructorDate: string;
  registerNumber: number;
  esDelit: null;
  steeringwheelNumber: number;
  armedKeyNum: number;
  fec_notifica_aseguramiento: null;
  fec_resolucion: null;
  notifiesInsuranceDate: null;
  folioUniversal: string;
  admissionDate: string;
  dateRulingHc: string;
  admissionDateHc: string;
}
