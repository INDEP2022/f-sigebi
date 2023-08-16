export interface IComerPaymentsRefVir {
  payId: number | string;
  payvirtueId: number | string;
  batchId: number | string;
  amount: number | string;
  typereference: number | string;
  amountGrief: number | string;
  numberRecord: number | string;
}

export interface IOI_DTO {
  idEvento: string;
  idLote: string;
  pTipo: string;
  clkpv: string;
}

export interface IOI {
  OI: string;
  MONTO: string;
  TIPO: string;
  DEVOLUCION: string;
  CVMAN: string;
}
