export interface ICustomer {
  id?: number;
  reasonName?: string;
  rfc?: string;
  sellerId?: ISeller | number;
  street?: string;
  city?: string;
  colony?: string;
  delegation?: string;
  zipCode?: string;
  country?: string;
  fax?: string;
  phone?: string;
  mailWeb?: string;
  state?: string;
  curp?: string;
  blackList?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  municipalityId?: number;
  stateId?: number;
  blackListDate?: string;
  releaseDate?: string;
  penaltyId?: {
    descPenalties: string;
    penaltyDays: number;
    penaltyId: number;
    process: string;
  };
  personType?: string;
  approvedRfc?: string;
  userFree?: {
    attribAsign: number;
    clkdet: number;
    clkdetSirsae: string;
    clkid: string;
    curp: string;
    daysValidityPass: number;
    email: string;
    exchangeAlias: string;
    firstTimeLoginDate: string;
    id: string;
    insideNumber: string;
    name: string;
    nameAd: string;
    passLastChangeDate: string;
    passUpdate: string;
    phone: string;
    posPrevKey: string;
    positionKey: number;
    profession: string;
    profileMimKey: string;
    registryNumber: number;
    rfc: string;
    sendEmail: string;
    street: string;
    suburb: string;
    userSirsae: string;
    zipCode: string;
  };
  freeDate?: string;
  registryNumber?: number;
  economicAgreementKey?: string;
  identificationType?: number;
  identificationNumber?: string;
  agentId?: {
    id?: number;
    reasonName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    dateBorn?: string;
    rfc?: string;
    curp?: string;
    personType?: string;
    identificationType?: number;
    autEmiIndentify?: string;
    identificationNumber?: string;
    escrowNumber?: string;
    nationalityKey?: string;
    countryOriginKey?: string;
    street?: string;
    outsideNumber?: string;
    insisdeNumber?: null;
    city?: string;
    suburb?: string;
    delegation?: string;
    zipCode?: number;
    state?: string;
    homeCountryKey?: string;
    fax?: string;
    countryPhoneKey?: string;
    phone?: number;
    mailWeb?: string;
    ecoActivityKey?: string;
    repAssociatedId?: string;
    registerNumber?: string;
  };
  outsideNumber?: string;
  insideNumber?: string;
  password?: string;
  user?: string;
  interbankKey?: string;
  bank?: string;
  branch?: string;
  checksAccount?: string;
  penaltyInitDate?: string;
  penaltyEndDate?: string;
  penalizeUser?: string;
}

export interface ISeller {
  cityNumber: string;
  colony: string;
  comission: string;
  id: string;
  outside: string;
  phone: string;
  reasonName: string;
  rfc: string;
  street: string;
}

export interface ICustomersPenalties {
  id: number;
  reference: number;
  movementNumber: number;
  date: string;
  amount: number;
  bankKey: string;
  code: number;
  pFlag: number;
  publicLot: number;
  registernumber: number;
  userPenalty: string;
  user: string;
  eventId: {
    id: number;
  };
  lotId: {
    id: number;
    publicLot: number;
  };
  clientId: {
    id: number;
  };
  validSystem: string;
  notInTime: string;
  description: string;
  type: string;
  incomeid: string;
  result: string;
  branchOffice: number;
  paymentIdReturns: string;
  reconciled: string;
  registrationDate: string;
  referenceOri: number;
  account: string;
  oiDate: string;
  appliedTo: string;
  customerId: number;
  oiFolio: string;
  indicator: string;
  codeEdoCta: string;
  affectedDate: string;
  registryNumber: string;
  satTypeId: number;
  expenseId: string;
  paymentRequestId: string;
}

export interface IHistoryCustomersPenalties {
  // data: any;
  customerId: number;
  batchId: number;
  penaltyId: number;
  eventId: number;
  batchPublic: number;
  initialDate: string;
  finalDate: string;
  processType: number;
  referenceJobOther: string;
  user: string;
  flag: number;
  recordNumber: number;
  usrPenalize: string;
  usrfree: string;
  penalizesDate: string;
  releasesDate: string;
  causefree: string;
  nbOrigin: string;
  // penalty: string;
}

export interface ICustomerPenaltiesModal {
  customerId: {
    id: number;
  };
  batchId: number;
  batchPublic: number;
  eventId: {
    id: number;
  };
  lotId: {
    id: number;
    publicLot: number;
  };
  processType: number;
  recordNumber: number;
  penaltyId: number;
  pFlag: number;
  referenceJobOther: string;
  initialDate: string;
  user: string;
  finalDate: string;
  nbOrigin: string;
  usrPenalize: string;
  penalizesDate: string;
  refeOfficeOther: string;
  userPenalty: string;
  penaltiDate: string;
}
