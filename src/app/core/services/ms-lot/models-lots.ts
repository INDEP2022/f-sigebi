export interface IPupProcSeldisp {
  saleStatusId: string;
  typeDispId: number | string;
  totalAmount: number | string;
  totalClient: number | string;
  comerClientXEventsEventId: number | string;
  dateGraceLiq: string;
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