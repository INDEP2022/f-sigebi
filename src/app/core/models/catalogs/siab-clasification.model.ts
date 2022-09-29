export interface ISiabClasification {
  id: number | null;
  typeId: number | null;
  typeDescription: string | null;
  subtypeId: number | null;
  subtypeDescription: string | null;
  ssubtypeId: number | null;
  ssubtypeDescription: string | null;
  sssubtypeId: number | null;
  sssubtypeDescription: string | null;
  creationUser: string | null;
  creationDate: Date | null;
  editionUser: string | null;
  editionDate: Date | null;
  version: number | null;
}
