export interface IComerDetExpense {
  expenseDetailNumber?: string;
  expenseNumber: string;
  amount: string | number;
  vat: string | number;
  isrWithholding: string | number;
  vatWithholding: string | number;
  transferorNumber?: string;
  goodNumber: string;
  total?: string | number;
  cvman: string;
  budgetItem: string;
  comerExpenses?: ComerExpenses;
  goods?: any;
  goodDescription?: string;
  changeStatus?: boolean;
  reportDelit?: boolean;
}

export interface IComerDetExpense2 {
  detPaymentsId: string;
  paymentsId: string;
  amount?: number;
  iva: number;
  retencionIsr: string;
  retencionIva: string;
  transferorNumber: string;
  goodNumber: string;
  total: number;
  manCV: string;
  departure: string;
  origenNB?: any;
  partialGoodNumber?: any;
  priceRiAtp?: any;
  transNumberAtp?: any;
  expendientNumber: number;
  clasifGoodNumber: number;
  value?: any;
  description?: any;
  eventId?: any;
  amount2: number;
  iva2: number;
  total2: number;
  parameter: string;
  mandato: string;
  vehiculoCount: string;
  labelNumber?: number;
  alternateClassificationNumber?: number;
  SELECT_CAMBIA_CLASIF_ENABLED?: boolean;
  V_VALCON_ROBO: number;
  changeStatus?: boolean;
  reportDelit?: boolean;
}

export interface IMandContaDTO {
  idGastos: number;
  pnoenviasirsae: string;
}

interface ComerExpenses {
  expenseNumber: string;
  conceptNumber: string;
  comment: string;
  amount: string;
  vat: string;
  invoiceRecNumber: string;
  invoiceRecDate: string;
  eventNumber: string;
  lotNumber?: any;
  paymentRequestNumber?: any;
  capturedUser: string;
  authorizedUser: string;
  requestedUser: string;
  fecha_contrarecibo: string;
  captureDate: string;
  payDay: string;
  attachedDocumentation: string;
  numReceipts: string;
  paymentInstructions?: any;
  monthExpense: string;
  vatWithheld: string;
  isrWithheld: string;
  folioAtnCustomer?: any;
  totDocument: string;
  formPayment: string;
  clkpv: string;
  providerName: string;
  monthExpense2?: any;
  monthExpense3?: any;
  monthExpense4?: any;
  monthExpense5?: any;
  monthExpense6?: any;
  monthExpense7?: any;
  monthExpense8?: any;
  monthExpense9?: any;
  monthExpense10?: any;
  monthExpense11?: any;
  monthExpense12?: any;
  spDate?: any;
  comproafmandsae: string;
  idOrdinginter?: any;
  exchangeRate?: any;
  nomEmplRequest: string;
  nomEmplAuthorizes: string;
  nomEmplcapture: string;
  ur_coordregional?: any;
  descurcoord?: any;
  address: string;
  usu_captura_siab?: any;
  dateOfResolution?: any;
  typepe?: any;
  tiptram?: any;
  contractNumber?: any;
  adj?: any;
  spFolio?: any;
  indicator?: any;
}
