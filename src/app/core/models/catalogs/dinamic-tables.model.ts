export interface ITables {
  table?: number; //nmtabla
  data?: any[];
  name: string;
  description: string;
  actionType: string;
  tableType: number;
  //numRegister: number;
}

export interface ITablesData {
  table?: string | any;
  name: string;
  description: string;
  actionType: string;
  tableType: number;
  //numRegister: number;
}

export interface ITablesType {
  nmtabla: number;
  cdtabla: string;
  dstabla: string;
  ottipoac: string;
  ottipotb: number;
  no_registro: number;
}

export interface ITable {
  table?: string;
  name: string;
  description: string;
  actionType: string;
  tableType: number;
  //numRegister: number;
}

export interface TvalTable1Data {
  otKey: string;
  table: ITables;
  value: string;
  numRegister: string;
  abbreviation: null;
}
