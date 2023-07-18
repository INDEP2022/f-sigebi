import { IPerson } from '../catalogs/person.model';
import { IGood } from '../ms-good/good';
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
  appointmentNum: number;
  nameProvDete: Date;
  revocationDate: Date;
  revocation: string;
  contractKey: string;
  startContractDate: Date;
  endContractDate: Date;
  amount: number;
  nameTypeKey: string;
  administratorTypeKey: string;
  assignmentDate: Date;
  appointmentDate: Date;
  cardAppointmentId: string;
  typeDepositary: string;
  observations: string;
  jobRevocationNum: string;
  amountConsideration: number;
  amountFee: number;
  jobProvisionalNum: string;
  exhibit: string;
  jobBoardgovtDate: Date;
  jobBoardgovtNum: string;
  shipmentDirgralDate: Date;
  replyDirgralDate: Date;
  jobShiftNum: string;
  shiftDate: Date;
  returnDate: Date;
  jobReplyNum: string;
  agreementAppointment: string;
  cardAppointmentIdBoardgovt: string;
  jobAnswerDirgralNum: string;
  authorityorderAssignment: string;
  responsible: string;
  representativeSera: string;
  goodNum: number;
  registryNum: number;
  validity: string;
  amountVat: number;
  folioUniversal: number;
  folioReturn: number;
  personNum: number;
  reference: string;
  vat: number;
  withHousehold: string;
  nbOrigin: string;
  personNumber?: IPerson; // Opcional para cargar los datos de la persona
  good?: IGood; // Opcional para cargar los datos del bien

  // appointmentNum: string | number;
  // nameProvDete: string | number;
  // revocationDate: Date;
  // revocation: string;
  // contractKey: string;
  // startContractDate: Date;
  // endContractDate: Date;
  // amount: number | string;
  // nameTypeKey: string;
  // administratorTypeKey: string;
  // assignmentDate: Date;
  // appointmentDate: Date;
  // cardAppointmentId: number;
  // typeDepositary: string;
  // observations: string;
  // jobRevocationNum: string;
  // amountConsideration: string;
  // amountFee: string;
  // jobProvisionalNum: number;
  // exhibit: string;
  // jobBoardgovtDate: Date;
  // jobBoardgovtNum: number;
  // shipmentDirgralDate: Date;
  // replyDirgralDate: Date;
  // jobShiftNum: number;
  // shiftDate: Date;
  // returnDate: Date;
  // jobReplyNum: number;
  // agreementAppointment: string;
  // cardAppointmentIdBoardgovt: string;
  // jobAnswerDirgralNum: number | string;
  // authorityorderAssignment: string;
  // responsible: string;
  // representativeSera: string;
  // goodNum: string | number;
  // registryNum: string | number;
  // validity: string;
  // amountVat: string;
  // folioUniversal: string;
  // folioReturn: string;
  // personNum: string | number;
  // reference: string;
  // vat: string;
  // withHousehold: string;
  // nbOrigin: string;
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

export interface IDepositaryAppointments_custom {
  InvoiceReturn: string;
  InvoiceUniversal: string;
  agreementAppointment: number;
  amount: number;
  amountFee: string;
  amountconsideration: string;
  amountvat: number;
  authorityorderAssignment: number;
  cveContract: string;
  cveGuyAdministrator: string;
  cveGuyname: string;
  dateAppointment: number;
  dateAssignment: number;
  dateEndContract: number;
  dateJobBoardgovt: number;
  dateReplyDirgral: number;
  dateReturn: number;
  dateRevocation: number;
  dateShift: number;
  dateShipmentDirgral: number;
  datenameProv: number;
  datestartContract: number;
  exhibit: number;
  good: IGood;
  guydepositary: number;
  identificationcardAppointment: number;
  identificationcardAppointmentBoardgovt: number;
  nbOrigin: number;
  numberAppointment: string;
  numberGood: string;
  numberJobAnswerDirgral: number;
  numberJobBoardgovt: number;
  numberJobProvisional: number;
  numberJobReply: number;
  numberJobRevocation: number;
  numberJobShift: number;
  numberPerson: string;
  numberRecord: string;
  observations: number;
  personNumber: IPerson;
  reference: number;
  representativeBe: string;
  responsible: string;
  revocation: string;
  user: ISegUsers;
  validity: number;
  vat: number;
  withHousehold: number;
}

// {
//   appointmentNum: number; // no_nombramiento
//   nameProvDete: Date; // fec_nomb_prov
//   revocationDate: Date; // fec_revocacion
//   revocation: string; // revocacion
//   contractKey: string; // cve_contrato
//   startContractDate: Date; // fec_ini_contrato
//   endContractDate: Date; // fec_fin_contrato
//   amount: number; // cantidad
//   nameTypeKey: string; // cve_tipo_nomb
//   administratorTypeKey: string; // cve_tipo_administrador
//   assignmentDate: Date; // fec_asignacion
//   appointmentDate: Date; // fec_nombramiento
//   cardAppointmentId: string; // cedula_nombramiento
//   typeDepositary: string; // tipo_depositaria
//   observations: string; // observaciones
//   jobRevocationNum: string; // no_oficio_revocacion
//   amountConsideration: number; // importe_contraprestacion
//   amountFee: number; // importe_honorarios
//   jobProvisionalNum: string; // no_oficio_provisional
//   exhibit: string; // anexo
//   jobBoardgovtDate: Date; // fec_oficio_junta_gob
//   jobBoardgovtNum: string; // no_oficio_junta_gob
//   shipmentDirgralDate: Date; // fec_envio_dir_gral
//   replyDirgralDate: Date; // fec_contestacion_dir_gral
//   jobShiftNum: string; // no_oficio_turno
//   shiftDate: Date; // fec_turno
//   returnDate: Date; // fec_retorno
//   jobReplyNum: string; // no_oficio_contestacion
//   agreementAppointment: string; // acuerdo_nombramiento
//   cardAppointmentIdBoardgovt: string; // cedula_nombramiento_junta_gob
//   jobAnswerDirgralNum: string; // no_oficio_contesta_dir_gral
//   authorityorderAssignment: string; // autoridad_ordena_asignacion
//   responsible: string; // responsable
//   representativeSera: string; // representante_sera
//   goodNum: IGood; // no_bien
//   registryNum: number; // no_registro
//   validity: string; // vigencia
//   amountVat: number; // importe_iva
//   folioUniversal: number; // folio_universal
//   folioReturn: number; // folio_regreso
//   personNum: IPerson; // no_persona
//   reference: string; // referencia
//   vat: number; // iva
//   withHousehold: string; // con_menaje
//   nbOrigin: string; // nb_origen
// }
export interface IVChecaPost {
  appointmentNumber: number;
  payDate: Date; //"2009-05-14",
  conceptPayKey: number;
}
export interface IVChecaPostReport {
  appointmentNumber: number;
  payDate: Date; //"2009-05-14",
  reportKey: number;
}
