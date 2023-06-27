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
