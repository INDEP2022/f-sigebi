export interface IProceedingDeliveryReception {
  id: string;
  keysProceedings: string;
  elaborationDate: string;
  datePhysicalReception: string;
  address: string;
  statusProceedings: string;
  elaborate: string;
  elaborateDetail?: { [key: string]: null | string };
  numFile: number;
  witness1: string;
  witness2: string;
  typeProceedings: string;
  dateElaborationReceipt: string;
  dateDeliveryGood: string;
  responsible: string;
  destructionMethod: string;
  observations: string;
  approvedXAdmon: string;
  approvalDateXAdmon: string;
  approvalUserXAdmon: string;
  numRegister: string;
  captureDate: string;
  numDelegation1: string;
  numDelegation2: string;
  identifier: Identifier;
  label: string;
  universalFolio: string;
  numeraryFolio: string;
  numTransfer: NumTransfer;
  idTypeProceedings: string;
  receiptKey: string;
  comptrollerWitness: string;
  numRequest: string;
  closeDate: string;
  maxDate: string;
  indFulfilled: string;
  dateCaptureHc: string;
  dateCloseHc: string;
  dateMaxHc: string;
  receiveBy: string;
  affair: string;
  numDelegation_1?: NumDelegation;
  numDelegation_2?: NumDelegation;
  numDelegation1Description?: string;
  numDelegation2Description?: string;
  file?: NumFile;
}

export interface Identifier {
  code: string;
  description: string;
  keyview: string;
  noRegistration: string;
}

export interface NumDelegation {
  id: string;
  description: string;
  numRegister: string;
  zoneContractCVE: string;
  diffHours: string;
  phaseEdo: string;
  zoneVigilanceCVE: null;
}

export interface NumFile {
  filesId: number;
  agreementDate: null;
  forecast: string;
  forecastDate: string;
  validatedItem: null;
  ministerialDate: null;
  ministerialAct: null;
  dictumDate: null;
  bateryId: null;
  lockerId: null;
  shelfId: null;
  judgedId: string;
  forecastObservation: null;
  insertedBy: null;
  observations: null;
  insertMethod: string;
  insertDate: string;
  seraReceptionDate: null;
  penaltyCause: string;
  previewFind: string;
  shelterCve: string;
  crimeCve: null;
  circumstantainedAct: null;
  penaltyCve: string;
  instituteName: string;
  judgeName: null;
  mpName: null;
  valueSaveCve: null;
  initialName: string;
  dictumOrderAuth: null;
  notifyDate: null;
  notifyA: null;
  notifyPlace: null;
  confiscationRulerDate: null;
  returnRulerDate: null;
  alienationDate: null;
  cveEntfed: string;
  rulerRecrevDate: null;
  registerId: string;
  destructionDate: null;
  donationDate: null;
  initialAgreementDate: null;
  initialAgreement: null;
  fileStatus: null;
  identifier: string;
  esDelit: null;
  transferringId: string;
  expTransferringId: null;
  fileType: string;
  senderId: string;
  authId: string;
  insertHcDate: null;
}

export interface NumTransfer {
  id: string;
  description: string;
  key: string;
  cvman: string;
  indcap: null;
  porc_comi: null;
  active: null;
  risk: null;
}
