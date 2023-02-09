// Proceduremanagement
export interface IProceduremanagement {
  noTramite: number;
  estatusTramite: string;
  situacionTramite: number;
  usrTurnado: string;
  fechaRealTramite: Date;
  noConsecutivoDiario: number;
  fecIngresoTramite: Date;
  noVolante: number;
  noExpediente: number;
  asunto: string | null;
  tipoAsunto: number | null;
  noOficio: string | null;
  clasifDicta: string | null;
  usrRegistro: string | null;
  descentfed: string | null;
  hojas: number | null;
  typeManagement: number | null;
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
}
