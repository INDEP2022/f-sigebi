export interface ICustomer {
  id?: number;
  reasonName: string;
  rfc: string;
  sellerId: ISeller | number;
  street: string;
  city: string;
  colony: string;
  delegation: string;
  zipCode: string;
  country: string;
  fax: string;
  phone: string;
  mailWeb: string;
  state: string;
  curp: string;
  blackList: string;
  paternalSurname: string;
  maternalSurname: string;
  municipalityId: number;
  stateId: number;
  blackListDate: string;
  releaseDate: string;
  penaltyId: number;
  personType: string;
  approvedRfc: string;
  userFree: string;
  freeDate: string;
  registryNumber: number;
  economicAgreementKey: string;
  identificationType: number;
  identificationNumber: string;
  agentId: number;
  outsideNumber: string;
  insideNumber: string;
  password: string;
  user: string;
  interbankKey: string;
  bank: string;
  branch: string;
  checksAccount: string;
  penaltyInitDate: string;
  penalizeUser: string;
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
