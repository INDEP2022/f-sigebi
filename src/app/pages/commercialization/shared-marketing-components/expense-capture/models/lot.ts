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

export interface IDivideCommandsDTO {
  eventId: string;
  amount2: number;
  iva2: number;
  withholdingIsr2: string;
  withholding_vat2: string;
  expenseId: string;
}
