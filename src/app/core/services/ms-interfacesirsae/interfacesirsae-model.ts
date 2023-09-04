export interface ISendSirsae {
  identificator: number | string;
  eventId: number | string;
}

export interface ISendSirsaeLot {}
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
