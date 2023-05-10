import { IGood } from '../good/good.model';
import { ISegUsers } from '../ms-users/seg-users-model';

export interface IAppointmentDepositary {
  appointmentNumber: string;
  nameProvDate: string;
  revocationDate: string;
  revocation: string;
  contractKey: string;
  contractStartDate: string;
  contractEndDate: string;
  quantity: string;
  typeNameKey: string;
  typeAdminKey: string;
  assignmentDate: string;
  appointmentDate: string;
  appointmentCard: string;
  depositaryType: string;
  observation: string;
  officialRevocationNumber: string;
  importConsideration: string;
  feeAmount: string;
  provisionalOfficialNumber: string;
  annexed: string;

  governmentMeetingOfficialDate: string;
  governmentMeetingOfficialNumber: string;
  shippingDateGeneralAddress: string;
  replyDateGeneralAddress: string;
  jobShiftNumber: string;
  turnDate: string;
  returnDate: string;
  answerOfficeNumber: string;
  appointmentAgreement: string;
  governmentBoardAppointmentCard: string;
  officialNumberAnswerAddressGeneral: string;
  authorityOrdersAllocation: string;
  responsible: string;
  seraRepresentative: string;
  propertyNumber: string;
  registerNumber: string;
  validity: string;
  amountIVA: string;
  universalFolio: string;
  folioReturn: string;
  personNumber: {
    id: string;
    nom_persona: string;
    nombre: string;
    calle: string;
    no_exterior: string;
    no_interior: string;
    colonia: string;
    deleg_munic: string;
    codigo_postal: string;
    rfc: string;
    curp: string;
    telefono: string;
    tipo_persona: string;
    tipo_responsable: string;
    representante: string;
    no_escritura: string;
    profesion: string;
    curriculum: string;
    cve_entfed: string;
    cve_giro: string;
    observaciones: string;
    perfil: string;
    antecedentes_secodam: string;
    antecedentes_pgr: string;
    antecedentes_pff: string;
    antecedentes_sera: string;
    antecedentes_otros: string;
    no_registro: string;
    email: string;
    lista_negra: string;
  };
  reference: string;
  iva: string;
  withKitchenware: string;
  good: IGood;
  user: ISegUsers;
}

export interface IRequestDepositary {
  propertyNumber: number;
  requestDate: Date;
  requestType: string;
  applicantSera: string;
  attentionDelegationNumber: number;
  attentionSubDelegationNumber: number;
  attentionDepartmentNumber: number;
  attentionDate: Date;
  attentionUser: string;
  registerNumber: number;
  proposedCandidate: string;
}
export interface IPersonsModDepositary {
  appointmentNum: number;
  personNum: string;
  process: string;
  dateExecution: Date;
  sentSirsae: string;
  modifyStatus: string;
  indicted: string;
  dateShipment: Date;
  sendSirsae: string;
  nbOrigin: string;
}

export interface IPaymendtDepParamsDep {
  name: number;
  address: string;
}
