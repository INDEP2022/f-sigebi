import { IPerson } from '../catalogs/person.model';
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
  personNumber: IPerson;
  // personNumber: {
  //   id: string;
  //   nom_persona: string;
  //   nombre: string;
  //   calle: string;
  //   no_exterior: string;
  //   no_interior: string;
  //   colonia: string;
  //   deleg_munic: string;
  //   codigo_postal: string;
  //   rfc: string;
  //   curp: string;
  //   telefono: string;
  //   tipo_persona: string;
  //   tipo_responsable: string;
  //   representante: string;
  //   no_escritura: string;
  //   profesion: string;
  //   curriculum: string;
  //   cve_entfed: string;
  //   cve_giro: string;
  //   observaciones: string;
  //   perfil: string;
  //   antecedentes_secodam: string;
  //   antecedentes_pgr: string;
  //   antecedentes_pff: string;
  //   antecedentes_sera: string;
  //   antecedentes_otros: string;
  //   no_registro: string;
  //   email: string;
  //   lista_negra: string;
  // };
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

export interface IDepositaryAppointments {
  // InvoiceReturn: string;
  // InvoiceUniversal: string;
  // agreementAppointment: ;
  // amount: null;
  // amountFee: '0.00';
  // amountconsideration: '0.00';
  // amountvat: null;
  // authorityorderAssignment: null;
  // cveContract: 'DG/DEBI/COMODATO/109/2015';
  // cveGuyAdministrator: 'C';
  // cveGuyname: 'P';
  // dateAppointment: null;
  // dateAssignment: null;
  // dateEndContract: null;
  // dateJobBoardgovt: null;
  // dateReplyDirgral: null;
  // dateReturn: null;
  // dateRevocation: '2015-09-17';
  // dateShift: null;
  // dateShipmentDirgral: null;
  // datenameProv: null;
  // datestartContract: '2015-04-13';
  // exhibit: null;
  // good: IGood;
  // guydepositary: '3';
  // identificationcardAppointment: null;
  // identificationcardAppointmentBoardgovt: null;
  // nbOrigin: null;
  // numberAppointment: '2846';
  // numberGood: '2307001';
  // numberJobAnswerDirgral: null;
  // numberJobBoardgovt: null;
  // numberJobProvisional: null;
  // numberJobReply: null;
  // numberJobRevocation: 'DEBI/DCB/396/15';
  // numberJobShift: null;
  // numberPerson: '152';
  // numberRecord: '625642073';
  // observations: null;
  // personNumber: IPerson;
  // reference: null;
  // representativeBe: 'PULIBARRI';
  // responsible: 'EMAYOR';
  // revocation: 'S';
  // user: ISegUsers;
  // validity: null;
  // vat: '0';
  // withHousehold: null;

  appointmentNum: string | number;
  nameProvDete: string | number;
  revocationDate: Date;
  revocation: string;
  contractKey: string;
  startContractDate: Date;
  endContractDate: Date;
  amount: number | string;
  nameTypeKey: string;
  administratorTypeKey: string;
  assignmentDate: Date;
  appointmentDate: Date;
  cardAppointmentId: number;
  typeDepositary: string;
  observations: string;
  jobRevocationNum: string;
  amountConsideration: string;
  amountFee: string;
  jobProvisionalNum: number;
  exhibit: string;
  jobBoardgovtDate: Date;
  jobBoardgovtNum: number;
  shipmentDirgralDate: Date;
  replyDirgralDate: Date;
  jobShiftNum: number;
  shiftDate: Date;
  returnDate: Date;
  jobReplyNum: number;
  agreementAppointment: string;
  cardAppointmentIdBoardgovt: string;
  jobAnswerDirgralNum: number | string;
  authorityorderAssignment: string;
  responsible: string;
  representativeSera: string;
  goodNum: string | number;
  registryNum: string | number;
  validity: string;
  amountVat: string;
  folioUniversal: string;
  folioReturn: string;
  personNum: string | number;
  reference: string;
  vat: string;
  withHousehold: string;
  nbOrigin: string;
}

export interface IDepositaryPaymentDet {
  appointmentNum: number;
  datePay: Date;
  conceptPayKey: number;
  amount: number;
  observation: string;
  registryNum: number;
  nbOrigin: string;
}

export interface IDepositaryDetrepo {
  appointmentNum: number;
  dateRepo: Date;
  reportKey: number;
  report: string;
  registryNum: number;
  nbOrigin: string;
}

export interface IInfoDepositary {
  reportDate: Date | string;
  report: string;
  personNum: string;
  goodNum?: string | number;
  registryNum?: number;
  nbOrigin?: null;
}
