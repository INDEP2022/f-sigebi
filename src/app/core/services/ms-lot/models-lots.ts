export interface IPupProcSeldisp {
  saleStatusId: string;
  typeDispId: number | string;
  totalAmount: number | string;
  totalClient: number | string;
  comerClientXEventsEventId: number | string;
  dateGraceLiq: string;
  comerLotsEventId: string;
}

export interface IPupValidateMandatoNfac {
  id_tipo_disp: number;
  id_evento: number;
}

export interface IPupProcDisp{
    typeDispId: string | number;
    comerEventsEventId: string;
    address: string;
    rgTotalLots: string;
    PROCESAR: any[];
    typeProcess: string;
}

export interface IPupProcEnvSirsae{
  typeProcess:string | number,
  lotId:string,
  clientId:string,
  typeDispId:string | number,
  rfc:string ,
  saleStatusId:string,
  address:string,
  comerLotsEventId:string,
  publicLot:string,
  comerEventsEventId:string,
  rgTotalLots:string,
  typeEventId:string
}

export interface IPupProcReproc{
  typeDispId: string | number,
  comerEventsEventId: string,
  PROCESAR: any[],
  rgTypeProcess: string
}

export interface IPupProcSelsirsae{
  saleStatusId: string,
  typeDispId: string | number,
  comerClientXEventsEventId: string,
  comerLotsEventId: string,
  comerEventsEventId: string
}

export interface IPupProcSelReproceso{
  saleStatusId: string,
  typeDispId: string | number,
  comerEventsEventId: string,
  totalClient: string,
  dateGraceLiq: string
}