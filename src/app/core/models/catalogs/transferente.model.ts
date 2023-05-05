export interface ITransferente {
  id?: number;
  nameTransferent?: string;
  keyTransferent?: string;
  userCreation?: string;
  dateCreation?: string;
  userUpdate?: string;
  dateUpdate?: string;
  typeTransferent?: string;
  version?: number;
  status?: string;
  type?: string;
  dateBegOperation?: string;
  dateFinalOperation?: string;
  assignor?: string;
  objectCharge?: string;
  sector?: string;
  formalization?: string;
  dateFormalization?: string;
  name?: string;
  entity?: string;
  amedingAgree?: string;
  dateAmeding?: string;
  typeGoods?: string;
  custodyGuardGoods?: string;
  destinyGoods?: string;
  daysAdminGoods?: string;
  cvman?: string;
  indcap?: string;
  active?: string;
  risk?: string;
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

export interface ITransferenteSae {
  id?: number;
  name?: string;
  keyCode?: string;
  userCreation?: string;
  creationDate?: Date;
  modificationUser?: string;
  modificationDate?: Date;
  type?: string;
  version?: number;
  status?: string;
  operationStartDate?: Date;
  operationEndDate?: Date;
  sedativePrincipal?: string; //cedante principal
  commissionedObject?: string; //objeto encaragdo
  sector?: string;
  formalization?: string;
  formalizationDate?: Date;
  entity?: string; //entidad
  agreementModification?: string; //convenio modificatorio
  agreementDate?: Date; //fecha convenio
  goodGuy?: string; //tipo bien
  guardGuardWell?: string; //guardia custodia bien
  destinyWelll?: string; //destino bien
  daysAdminGood?: string; //dias admin bien
  goodReceptionPlace?: string; //lugar recepcion bien
}
