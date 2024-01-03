export interface IPayment {
  processId: string;
  numbermovement: string;
  referenceori: string;
  amount: string;
  tsearchId: string;
  payId?: any;
  batchId?: any;
  idEvent?: any;
  idCustomer?: any;
  idGuySat: string;
  idselect: string;
  incomeid?: any;
  idinconsis: string;
  date: string;
  reference: string;
  cveBank: string;
  code: string;
  batchPublic?: any;
  validSystem?: any;
  result?: any;
  description: string;
  account: string;
  guy: string;
  downloadinconsis: string;
  geneReference?: any;
  referencealt?: any;
  amountalt?: any;
  valIndicted?: any;
  typereference?: any;
  searchPaymentsMae: ISearchPaymentsMae;
}

export interface ISearchPaymentsMae {
  tsearchId: string;
  desTsearch: string;
}
