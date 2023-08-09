export interface IThirdPartyCompany {
  id?: number;
  keyCompany?: string;
  description?: string;
  keyZoneContract: IThirdParty;
}

export interface IThirdParty {
  id?: number;
  description: string;
  registerNumber?: number;
  zoneStatus?: number;
}
