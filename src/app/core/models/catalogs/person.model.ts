export interface IPerson {
  id?: number;
  personName?: number;
  name?: string;
  street?: string;
  streetNumber?: string;
  apartmentNumber?: string;
  suburb?: string;
  delegation?: string;
  zipCode?: number;
  rfc?: string;
  curp?: string;
  phone?: string;
  typePerson?: string;
  typeResponsible?: string;
  manager?: string;
  numberDeep?: string;
  profesion?: string;
  curriculum?: string;
  keyEntFed?: string;
  keyOperation?: string;
  observations?: string;
  profile?: string;
  precedentSecodam?: string;
  precedentPgr?: string;
  precedentPff?: string;
  precedentSera?: string;
  precedent0ther?: string;
  registryNumber?: number;
  email?: string;
  state?: IState | number;
  blackList?: string;
}
export interface IState {
  id: number;
  descCondition: string;
  codeCondition: string;
  registrationNumber: number;
  nmtable: number;
  abbreviation: string;
  risk: string;
  version: string;
  zoneHourlyStd: string;
  zoneHourlyVer: string;
  userCreation: string;
  creationDate: string;
  userModification: string;
  modificationDate: string;
}
