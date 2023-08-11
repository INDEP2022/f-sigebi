export interface IStateOfRepublic {
  id?: string;
  descCondition?: string;
  codeCondition: string;
  registrationNumber: number;
  nmtable: number;
  abbreviation?: string;
  risk?: string;
  version?: string;
  zoneHourlyStd: string;
  zoneHourlyVer: string;
  userCreation: string;
  creationDate: string;
  userModification: string;
  modificationDate: string;
}

export interface IStateOfRepublicGetAll {
  idState?: string;
  descCondition?: string;
}
