export interface IStateOfRepublic {
  stateCode: string;
  entityName: string | null;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  keyState: number;
  version: number | null;
  stdTimezone: string;
  verTimezone: string;
}
