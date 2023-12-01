export interface IComerPaymentsRefVir {
  payId: number | string;
  payvirtueId: number | string;
  batchId: number | string;
  amount: number | string;
  typereference: number | string;
  amountGrief: number | string;
  numberRecord: number | string;
}

export interface IComerReldisDisp {
  user: string;
  inddistance: number;
  indsirsae: number;
  numberRecord: number;
  indlibpg: number;
}

export interface IOI_DTO {
  idEvento: string;
  idLote: string;
  pTipo: string;
  clkpv: string;
}

export interface IOI {
  oi: string;
  monto: string;
  tipo: string;
  devolucion: string;
  mandato: string;
}

export interface IApplicationFComerCtldPag3 {
  dispTypeId: number;
  originId: number;
  direction: string;
  ctldevpagKey: string;
  cRelEvents: [];
}

export interface ICabms {
  CLKCABMS: string;
  CLKSUBCAT: number;
  CVDSC: string;
  CVPART: string;
  CVSUBPART: string;
  CODOPE: string;
  CVDSC2: string;
}
