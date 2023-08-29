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
