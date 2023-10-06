export interface ISendSirsae {
  identificator: number | string;
  eventId: number | string;
}

export interface ISendSirsaeLot {
  PROCESAR: any[];
  PROCESO: string;
  COMER_EVENTOS_ID_EVENTO: string;
  ID_TPEVENTO: string;
  ID_TIPO_DISP: string | number;
}

export interface IValidPaymentsDTO {
  pClkpv: string;
  pComment: string;
  pPayAfmandSae: string;
  pNumberVoucher: string;
  pDocumentationAnexa: string;
  pUserCapture: string;
  pUserAuthorize: string;
  pUserRequest: string;
  pFormPay: string;
  pEventId: number;
  pLotePub: number;
}

export interface ISirsaeDTO {
  spentId: number;
  conceptId: number;
  comment: string;
  clkpv: number;
  paymentWay: string;
  user: string;
  spentMonth: string;
  spentMonth2: string;
  spentMonth3: string;
  spentMonth4: string;
  spentMonth5: string;
  spentMonth6: string;
  spentMonth7: string;
  spentMonth8: string;
  spentMonth9: string;
  spentMonth10: string;
  spentMonth11: string;
  spentMonth12: string;
  paymentDate: string;
  proofNumber: number;
  attachedDocumentation: string;
  recVoucherNumber: string;
  recVoucherDate: string;
  contract: string;
  eventId: number;
  requestUser: number;
  authorizeUser: number;
  capturedUser: number;
  comproafmandsae: number;
  lotId: number;
  direction: string;
}

export interface ISirsaeScrapDTO {
  spentId: string;
  payRequestId: string;
  conceptId: string;
  urCoordRegional: string;
  comment: string;
  paymentWay: string;
  monthSpent: string;
  monthSpent2: string;
  monthSpent3: string;
  monthSpent4: string;
  monthSpent5: string;
  monthSpent6: string;
  monthSpent7: string;
  monthSpent8: string;
  monthSpent9: string;
  monthSpent10: string;
  monthSpent11: string;
  monthSpent12: string;
  paymentDate: string;
  voucherNumber: string;
  attachedDocumentation: string;
  billRecNumber: string;
  billRecDate: string;
  contract: string;
  eventId: string;
  userRequests: string;
  userAuthorizes: string;
  userCaptured: string;
  comproafmandsae: string;
  totDocument: string;
  clkpv: string;
}
export interface ISendSirsaeOIScrapDTO {
  pEventId: string;
  pCoordRegionalUR: string;
  pConcept: string;
  pEvent: string;
  pDateBillRec: string;
  pAmount: string;
  pSpent: string;
  pMandato2: string;
  pAmountTOT: string;
}
