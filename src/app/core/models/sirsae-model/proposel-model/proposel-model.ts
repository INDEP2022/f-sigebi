export interface IProposel {
  ID_PROPUESTA: number;
  ID_SOLICITUD: number;
  FEC_PROPUESTA: string;
  CANT_SOLICITADA: number;
  CANT_PROPUESTA: number;
  CANT_DONADA: number;
  FEC_ENTREGA: string;
  FEC_AUTORIZA: string;
  PRP_ESTATUS: string;
}

export interface IRequest {
  solQuantity: number;
  requestId: number;
  entFedKey: number;
  requestDate: string;
  clasifGood: number;
  justification: string;
  sunStatus: string;
  proposalCve: string;
  requestTypeId: string;
}

export interface IDeleteGoodDon {
  pRequestId: number;
  pGoodNumber: number;
  pStatus: string;
  pUser: string;
}
