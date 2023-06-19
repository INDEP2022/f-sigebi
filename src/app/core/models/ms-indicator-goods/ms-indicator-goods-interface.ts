export interface IGoodsByProceeding {
  ciudad_transferente: string;
  clave_contrato_donacion: string;
  clave_acta_devolucion: string;
  clave_dictamen: string;
  clave_acta_destruccion: string;
  no_bien: string;
  estatus: string;
  descripcion: string;
  tipo_bien: string;
  no_expediente: string;
  cantidad: string | number;
  fec_aprobacion_x_admon: string;
  fec_indica_usuario_aprobacion: string;
  cve_evento: string;
  cve_dic_donacion: string;
  destino: string;
  agregado: string;
}

export interface IDetailIndicatorGood {
  actNumber: string;
  goodNumber: string;
  amount: string;
  received: string;
  approvedXAdmon?: any;
  approvedXAdmonDate?: any;
  userApprovedXAdmon?: any;
  indicatesUserApprovalDate?: any;
  registryNumber: string;
  reviewIndft: string;
  correctIdft: string;
  userIdft?: any;
  idftDate?: any;
  delegationIdftNumber: string;
  yearIdft: string;
  monthIdft: string;
  idftHcDate?: any;
  packageNumber: string;
  valChange: string;
}
