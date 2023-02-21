export interface Datum {
  table: string;
  otKey: string;
  value: string;
  abbreviation?: any;
  numRegister: string;
}

export interface Table {
  table: string;
  name: string;
  description: string;
  actionType: string;
  tableType: string;
  numRegister: string;
  data: Datum[];
}

export interface Data {
  table: Table;
}

export interface ICircuitM {
  data: Data;
}
