export interface ITransferente {
  id?: number;
  nameTransferent: string;
  keyTransferent: string;
  userCreation: string;
  dateCreation: string;
  userUpdate: string;
  dateUpdate: string;
  typeTransferent: string;
  version: number;
  status: string;
  dateBegOperation: string;
  dateFinalOperation: string;
  assignor: string;
  objectCharge: string;
  sector: string;
  formalization: string;
  dateFormalization: string;
  entity: string;
  amedingAgree: string;
  dateAmeding: string;
  typeGoods: string;
  custodyGuardGoods: string;
  destinyGoods: string;
  daysAdminGoods: string;
  cvman: string;
  indcap: string;
  active: string;
  risk: string;
  nameAndId?: string;
}

export interface ITransferingLevelView {
  uniqueCve: string | number;
  transfereeNum: string | number;
  transfereeDesc: string;
  transferShortName: string;
  stationNum: string | number;
  stationDesc: string | number;
  authorityNum: string | number;
  authorityDesc: string | number;
  cityNum: string | number;
  cityDesc: string;
  federalEntityCve: string | number;
  federalEntityDesc: string;
}
