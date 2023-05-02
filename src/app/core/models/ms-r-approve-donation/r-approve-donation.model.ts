export interface IRapproveDonation {
  labelId: number;
  status: string;
  desStatus: string;
  transfereeId: number | ITransferee;
  desTrans: string;
  clasifId: number;
  desClasif: string;
  unit: string;
  ruleId: number;
  valid: number;
  amount: null;
}
export interface ITransferee {
  transferentId: number;
  transferentDesc: string;
  keyCode: string;
  cvman: string;
  indcap: string;
  porcComi: string;
  active: string;
  risk: string;
}
