export interface InvoiceFolio {
  folioinvoiceId: string;
  statusfactId: string;
  delegationNumber: string;
  series: string;
  invoiceStart: string;
  invoiceEnd: string;
  validity: string;
  recordUser: string;
  recordDate: string;
  availableFolios: string;
  usedFolios: string;
  type: string;
  originNb: any;
  comerStatus: ComerStatus;
  totalFolios?: number;
}

export interface ComerStatus {
  idstatusfact: string;
  description: string;
  originNb: any;
}

export interface InvoiceFolioSeparate {
  folioinvoiceId: string;
  series: string;
  invoice: string;
  pulledapart: string;
  recordNumber: string;
  recordDate: string;
  originNb: any;
  comerF: ComerF;
}

export interface ComerF {
  folioinvoiceId: string;
  statusfactId: string;
  delegationNumber: string;
  series: string;
  invoiceStart: string;
  invoiceEnd: string;
  validity: string;
  recordUser: string;
  recordDate: string;
  availableFolios: string;
  usedFolios: string;
  type: string;
  originNb: any;
}
