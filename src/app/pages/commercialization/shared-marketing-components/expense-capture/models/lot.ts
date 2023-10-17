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

export interface ILoadLotDTO {
  pEventId: number;
  pBatchId: number;
  pConceptoId: number;
  pScreen: string;
}

export interface IComerDetGastosDTO {
  select_cambia_status: string;
  no_bien: number;
}

export interface ICancelVtaDTO {
  id_lote: string;
  id_gasto: string;
  id_evento: string;
  lote_pub: string;
  pMotivo: string;
  id_concepto: string;
  p_prueba: string;
  user: string;
  comer_detgastos: IComerDetGastosDTO[];
  cat_motivos_rev: string[];
}
