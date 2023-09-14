export interface IHistoryGood {
  propertyNum?: string | number;
  status?: string;
  changeDate?: Date | string;
  userChange?: string;
  statusChangeProgram?: string;
  reasonForChange?: string;
  registryNum?: string | number;
  extDomProcess?: string;
}

export interface ISentSirsae {
  armyJobKey: string;
  dictNumber?: number;
  userDictates?: string;
  delegationNumOpinion: number;
  dictType?: string;
  rulingStatus?: string;
  rulingType?: string;
  date: string;
  user?: string;
  expedientNumber: number;
}
export interface IReturnStatusProcess {
  pGoodNumber: number;
  pStatus: string;
}
export interface IHistoricGoodsAsegExtdom {
  proceedingsNumber: number;
  goodNumber: number;
  dateChange: Date;
  userChange: string;
  datefree: Date;
  userfree: string;
  processExtSun: string;
  recordNumber: number;
  invoiceUnivChange: number;
  invoiceUnivfree: number;
  nbOrigin: string;
}
