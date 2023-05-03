export interface IHistoryGood {
  propertyNum: string | number;
  status: string;
  changeDate: Date;
  userChange: string;
  statusChangeProgram: string;
  reasonForChange: string;
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
