export interface IEntfed {
  id: number;
  otKey: string;
  otWorth: string;
  noRegistration: number;
  abbreviation: string;
  risk: string;
}

export interface IEntfed2 {
  id: string;
  downloadState: string;
  codeState: string;
  registerNumber: number;
  nmtable: number;
  abbreviation: string;
  risk: string;
  version: number;
}
