export interface IPolicyXBien {
  id: string | number;
  goodNumberId: string | number;
  additionInsured?: string;
  amountCousin?: string;
  shortDate?: Date;
  enPolicyValid?: string;
  factorCostDaily?: string;
  amountNoteCredit?: string;
  responsibleShort?: string;
  registrationNumber?: string | number;
  policyKeyId?: string;
  beginningDateId?: string | number;
  currencySaKey?: string;
  entryDate?: Date;
  process?: string;
  Policies: IPolicy;
}

export interface IPolicy {
  policyKeyId: string;
  beginningDateId: Date;
  description: string;
  termDate: string;
  insurancecarrier: string;
  serviceKey: string | number;
  type: string;
  renewal: string;
  registrationNumber: string | number;
  policyAntKey: string;
  amountCousin: string;
  amountCousinPror: string;
  beginningAntDate: Date;
  termAntDate: string;
  requestSpentENumber: string;
  requestEntryENumber: string;
  iva: string;
  typeChange: string;
  amountSpentExp: string;
  requestSpentNumber: string;
  idSpent: string;
}

export interface IDeletePolicyXGood {
  goodNumberId: string | number;
  policyKeyId: string;
  beginningDateId: Date;
}

export interface IPolicyxRequest {
  id: string;
  entryDate: string;
  currencySaKey: string;
  currencyCousinKey: string;
  amountCousin: string;
  paidout: string;
  policyKey: string;
  beginningDate: string;
  requestNumber: string;
  requestShortNumber?: string;
  registrationNumber: string;
  Policies: {
    policyKeyId: string;
    beginningDateId: string;
    description: string;
    termDate: string;
    insurancecarrier: string;
    serviceKey: string;
    type: string;
    renewal: string;
    registrationNumber: string;
    policyAntKey: string;
    amountCousin: string;
    amountCousinPror: string;
    beginningAntDate: string;
    termAntDate: string;
    requestSpentENumber: string;
    requestEntryENumber: string;
    iva: string;
    typeChange: string;
    amountSpentExp: string;
    requestSpentNumber: string;
    idSpent: string;
  };
  RequestsXSure: {
    id: string;
    type: string;
    requestDate: string;
    expirationDate: string;
    observations: string;
    usernameDestiny: string;
    usernameSource: string;
    recordNumber: string;
  };
}

export interface IPolicyxSubtype {
  policyKeyId: string;
  beginningDate: Date;
  typeNumberId: number | string;
  subtypeNumberId: number | string;
  ssubtypeNumberId: number | string;
  sssubtypeNumberId: number | string;
  concept: string;
  currencyCousinKey?: string;
  currencySaKkey?: number | string;
  registrationNumber: number | string;
  consecPol: number | string;
}
