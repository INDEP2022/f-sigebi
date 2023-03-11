export interface IDictation {
  id?: number;
  passOfficeArmy: string | null;
  expedientNumber: number;
  typeDict: string;
  statusDict: string | null;
  dictDate: Date | null;
  userDict: string;
  observations: string | null;
  delegationDictNumber: number | null;
  areaDict: number | null;
  instructorDate: Date | null;
  registerNumber: number | null;
  esDelit: string | null;
  wheelNumber: number | null;
  keyArmyNumber: number | null;
  notifyAssuranceDate: Date | null;
  resolutionDate: Date | null;
  notifyResolutionDate: Date | null;
  folioUniversal: number | null;
  entryDate: Date | null;
  dictHcDAte: Date | null;
  entryHcDate: Date | null;
}
