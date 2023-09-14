//TODO: Validate Data Types
export interface IGlobalVars {
  RAST_BIEN: string;
  RAST_BIEN_REL: string;
  NO_EXPEDIENTE: string;
  RAST_EXPEDIENTE_REL: string;
  CREA_EXPEDIENTE: string;
  RAST_EXPEDIENTE: string;
  RAST_DESCRIPCION_BIEN: string;
  RAST_TIPO: string;
  gNoExpediente: number | string;
  noVolante: number;
  bn: number;
  gCreaExpediente: string;
  gstMensajeGuarda: string;
  gnuActivaGestion: number;
  antecede: number;
  pSatTipoExp: string | number;
  pIndicadorSat: string | number;
  gLastCheck: number;
  vTipoTramite: number;
  gCommit: string | number;
  gOFFCommit: string | number;
  noTransferente: string | number;
  gNoVolante: string | number;
  varDic: string;
  bienes_foto: number;
  //TODO: HOLOGAR MODELO DE VARIABLES GLOBALES
  EXPEDIENTE: string | number;
  TIPO_DIC: string | number;
  VOLANTE: string | number;
  CONSULTA: string;
  TIPO_VO: string | number;
  P_GEST_OK: string | number;
  P_NO_TRAMITE: string | number;
  REL_BIENES: number;
  IMP_OF: any;
  NO_EXPEDIENTE_F?: string | number;
  TIPO_DICTA_F?: string;
  G_REGISTRO_BITACORA?: string | number;
}
