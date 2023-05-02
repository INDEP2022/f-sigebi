export interface IDonationGood {
  statusId: string;
  noLabel: string;
  status: Status;
  tag: Tag;
  tagId?: string;
  statusDesc?: string;
  tagDesc: string;
}

export interface Status {
  status: string;
  description: string;
  registerNumber: string;
  managementNumber?: any;
  rencuenNumber: string;
  juntgobNumber: string;
  inmalmNumber: string;
  copNumber: string;
  rencuenCod: string;
  juntgobCod: string;
  inmalmCod: string;
  copCod: string;
}

export interface Tag {
  id: string;
  description: string;
}

export interface IFilterDonation {
  statusId: string;
  noLabel: number;
}
