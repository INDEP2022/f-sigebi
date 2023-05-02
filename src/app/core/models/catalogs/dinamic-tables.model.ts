export interface ITables {
  table?: number; //nmtabla
  data?: any[];
  name: string;
  description: string;
  actionType: string;
  tableType: number;
  numRegister?: number;
}

export interface ITablesData {
  table?: string | any;
  name: string;
  description: string;
  actionType: string;
  tableType: number;
  numRegister?: number;
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
  name?: string;
  description?: string;
  actionType?: string;
  tableType?: number;
  //numRegister: number;
}

export interface TvalTable1Data {
  otKey: string;
  table: ITable;
  value: string;
  numRegister: string;
  abbreviation: null;
  otKeyAndValue?: string;
  otKey1?: string;
  otValue01?: string;
  otValue02?: string;
  otValue03?: string;
}

export interface ISingleTable {
  table?: number; //nmtabla
  data: ITablesEntryData;
  name: string;
  description: string;
  actionType: string;
  tableType: number;
  numRegister?: number;
}

export interface ITablesEntryData {
  otKey: string | number;
  table: string | number;
  value: string;
  numRegister: string | number;
  abbreviation: string | null;
  otKeyAndValue?: string;
}
