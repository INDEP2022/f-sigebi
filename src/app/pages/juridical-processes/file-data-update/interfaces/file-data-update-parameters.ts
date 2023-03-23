// export interface IGlobalFileDataUpdate {
//   gNoExpediente: number | string | null;
//   noVolante: number | null;
//   bn: number | null;
//   gCreaExpediente: string | null;
//   gstMensajeGuarda: string | null;
//   gnuActivaGestion: number | null;
//   antecede: number | null;
//   pSatTipoExp: string | number | null;
//   pIndicadorSat: string | number | null;
//   gLastCheck: number | null;
//   vTipoTramite: number | null;
//   gCommit: string | number;
//   gOFFCommit: string | number;
//   noTransferente: string | number;
//   gNoVolante: string | number;
// }

export interface IJuridicalFileDataUpdateParams {
  pGestOk: number;
  pNoTramite: number;
  dictamen: boolean;
}

export interface IJuridicalRulingParams {
  expediente: number;
  tipoDic: number | string;
  volante: number;
  consulta: string;
  tipoVo: string;
  pGestOk: number;
  pNoTramite: number;
}

export interface IJuridicalDocumentManagementParams {
  volante: number;
  expediente: number;
  doc: number | string;
  tipoOf: number | string;
  sale: string;
  bien: string;
  pGestOk: number;
  pNoTramite: number;
  pDictamen: number | string;
}

export interface IJuridicalRelatedDocumentManagementParams {
  volante: number;
  expediente: number;
  pGestOk: number;
  pNoTramite: number;
}

export interface IJuridicalShiftChangeParams {
  iden: number;
  exp: number;
  pNoTramite: number;
}
