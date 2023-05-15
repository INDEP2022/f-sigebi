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
  no_clasif_bien: number;
  no_bien: number;
  no_departamento_destinatario: number;
  no_delegacion_destinatario: number;
  no_delegacion_dictam: number;
  tipo: string;
  usuario: string;
  ciudad: string;
  iden: string;
  num_clave_armada: number;
  toolbar_no_departamento: number;
  toolbar_no_subdelegacion: number;
  estatus_dictaminacion: string;
  proceso_ext_dom: string;
  paquete: number;
}
