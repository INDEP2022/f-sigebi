export interface IProceduremanagement {
  id?: number;
  status: string;
  situation: number;
  userTurned: string;
  actualDate: Date | string;
  dailyConsecutiveNumber: number;
  admissionDate: Date | string;
  flierNumber: number;
  expedient: number;
  affair: string;
  affairType: number;
  officeNumber: string;
  classificationDicta: string;
  registerUser: string;
  descentfed: string;
  areaToTurn?: string;
  userToTurn?: string;
  observation?: string;
  observationAdd?: string;
  sheet: number;
  businessDay?: number;
  naturalDay?: number;
  delegation?: number;
  folio?: number;
  prioirity?: string;
  serieIfai?: string;
  admissionDateHC?: Date;
  actualDateHC?: Date;
  affairSij?: number;
  affairSijp?: number;
  typeManagement?: number;
}
// ManagamentProcessSat
export interface IManagamentProcessSat {
  processNumber: number;
  processStatus: string;
  processEntryDate: Date;
  wheelNumber: number;
  proceedingsNumber: string;
  issue: string;
  officeNumber: string | null;
  delegationNumber: number | null;
  turnadoiUser: string | null;
}
// ManagamentProcessPgr
export interface IManagamentProcessPgr {
  processNumber: number;
  processStatus: string;
  processEntryDate: Date;
  wheelNumber: number;
  proceedingsNumber: number;
  issue: string;
  officeNumber: string;
  delegationNumber: number | null;
  turnadoiUser: string;
}
// ManagementArea
export interface IManagementArea {
  id: string | null;
  description: string | null;
  screenKey: string | null;
  managementNumber: number | null;
  nameAndId?: string;
}

export interface IManagementGroupWork {
  groupNumber: number | null;
  user: string | null;
  turnar: string | null;
  watch: string | null;
  send: string | null;
  managementArea: string | null;
  predetermined: string | null;
}
