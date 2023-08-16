export interface ILotDTO {
  p_fpago: string;
  id_evento: string;
  lotePub: string;
}

export interface IValidStatusChangeDTO {
  id_gasto: string;
  id_lote: string;
}

export interface IValidSubPriceDTO {
  eventId: string;
  lotId: string;
  spentId: string;
}
