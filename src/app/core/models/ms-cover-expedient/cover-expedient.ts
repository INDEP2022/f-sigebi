export interface IUserCoverExpedient {
  usrId?: number;
  Nombre?: string;
}

export interface IUnitCoverExpedient {
  IdUnidad?: number;
  DscUnidad?: string;
}

export interface IFileCoverExpedient {
  arhDescripcion?: string;
  arhID?: number;
}

export interface IDispositionCoverExpedient {
  ddcId?: number;
  ddcCodificacion?: string;
  PeriodoReserva?: number;
  VArchivoTramite?: number;
  VArchivoConcentracion?: number;
}
