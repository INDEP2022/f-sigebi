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
  table?: any;
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

export interface TvalTable1Data {
  otKey: string;
  table: ITables;
  value: string;
  numRegister: string;
  abbreviation: null;
}
// export interface ITdescatrib {
//   idNmTable: number; //nmtabla
//   keyAtrib: number;
//   descriptionAtrib: string;
//   swFormat: string;
//   longMin: number;
//   longMax: number;
//   registerNumber: number;
// }

// export interface ITdescCves {
// id: number; //nmtabla
// dsKey1: string;
// swFormat1: string;
// longMin1: number;
// longMax1: number;
// dsKey2: string;
// swFormat2: string;
// longMin2: number;
// longMax2: number;
// dsKey3: string;
// swFormat3: string;
// longMin3: number;
// longMax3: number;
// dsKey4: string;
// swFormat4: string;
// longMin4: number;
// longMax4: number;
// dsKey5: string;
// swFormat5: string;
// longMin5: number;
// longMax5: number;
// registerNumber: number;
// }
