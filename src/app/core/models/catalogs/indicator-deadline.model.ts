export interface IIndicatorDeadline {
  id: number;
  indicator: string;
  formula: string;
  deadline: number;
  userCreation: string;
  creationDate: Date;
  userModification: string;
  modificationDate: Date;
  status: number;
  version: number;
}
