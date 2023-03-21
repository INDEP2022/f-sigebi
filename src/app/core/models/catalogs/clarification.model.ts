export interface IClarification {
  id: number | null;
  clarification: string | null;
  type: number | null;
  creationUser: string | null;
  creationDate: Date | null;
  editionUser: string | null;
  modificationDate: Date | null;
  version: number | string | null;
  active: number | string | null;
}
