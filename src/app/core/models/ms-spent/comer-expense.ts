export interface IComerExpenseDTO {
  expenseNumber: string;
  conceptNumber: string;
  comment: string;
  amount: string;
  vat: string;
  invoiceRecNumber?: any;
  invoiceRecDate?: any;
  eventNumber: string;
  lotNumber: string;
  paymentRequestNumber?: any;
  capturedUser: string;
  authorizedUser: string;
  requestedUser: string;
  fecha_contrarecibo?: any;
  captureDate: string;
  payDay: string;
  attachedDocumentation: string;
  numReceipts: string;
  paymentInstructions?: any;
  monthExpense?: any;
  vatWithheld: string;
  isrWithheld: string;
  folioAtnCustomer: string;
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
  monthExpense8: string;
  monthExpense9?: any;
  monthExpense10?: any;
  monthExpense11?: any;
  monthExpense12?: any;
  spDate?: any;
  comproafmandsae: string;
  idOrdinginter?: any;
  exchangeRate?: any;
  nomEmplRequest?: any;
  nomEmplAuthorizes?: any;
  nomEmplcapture?: any;
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

export interface IComerExpense extends IComerExpenseDTO {
  comerLot: IComerLot;
  concepts: IConcepts;
  comerEven: IComerEven;
}

export interface IFillExpensesDTO {
  idEvent: string;
  idStatusVta: string;
}

export interface IFillExpenseData {
  combined: IFillExpenseDataCombined[];
  totevent: number;
  updateAllowed: boolean;
  ApplyUpdateAllowed: boolean;
  ApplyEnabled: boolean;
  ApplyNavigable: boolean;
}

export interface IFillExpenseDataCombined {
  id_gasto: string;
  descripcion: string;
  monto: string;
  id_solicitudpago?: string;
  cvman?: string;
}
export interface IComerEven {
  id: number;
  eventTpId: string;
  statusVtaId: string;
  processKey: string;
  observations: string;
  address: string;
  failureDate: string;
  place: string;
  eventDate: string;
  text1?: any;
  text2?: any;
  signer?: any;
  signerPosition?: any;
  notes: string;
  endText3?: any;
  endText4?: any;
  baseCost?: any;
  baseVendNumber?: any;
  user: string;
  month: string;
  year: string;
  delegationNumber: string;
  phaseInmu?: any;
  thirdComerId?: any;
  notificationDate?: any;
  eventClosingDate: string;
  tpsolavalId?: any;
  vatApplies: string;
}

export interface IConcepts {
  id: string;
  description: string;
  routineCalculation?: any;
  automatic: string;
  address: string;
  numerary?: any;
}

export interface IComerLot {
  id: number;
  statusVtaId: string;
  eventId: string;
  publicLot: string;
  description: string;
  baseValue: string;
  transferenceNumber: string;
  customerId: string;
  appraisalPriceRef?: any;
  warrantyPrice: string;
  deliveryDate?: any;
  finalPrice: string;
  referenceG: string;
  referential: string;
  accumulated: string;
  systemValid: string;
  lotVat: string;
  amountAppVat: string;
  amountNoAppVat: string;
  vatAppPercentage: string;
  vatNoAppPercentage: string;
  regCoordination: string;
  regCoordinator?: any;
  fiscMandFact?: any;
  ubication?: any;
  advance: string;
  amountWithoutVat: string;
  notifyOfficeNumber?: any;
  notifyPrint?: any;
  statusVtantId: string;
  goodsNumber?: any;
  faultExceeds?: any;
  assignedEs?: any;
  scrapEs?: any;
  request?: any;
  withheldAmount?: any;
  delegationNumber: string;
  originLot?: any;
  lotCover?: any;
  palette?: any;
  assignedWarranty: string;
  liqAmount: string;
  phase?: any;
  partialitiesNumber?: any;
  percentPoints: string;
  advancePercent?: any;
  vatA?: any;
}
