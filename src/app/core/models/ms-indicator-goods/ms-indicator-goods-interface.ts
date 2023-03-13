export interface IGoodsByProceeding {
  ciudad_transferente: string;
  no_bien: string;
  estatus: string;
  descripcion: string;
  tipo_bien: string;
  no_expediente: string;
  cantidad: string;
  fec_aprobacion_x_admon: string;
  fec_indica_usuario_aprobacion: string;
  destino: string;
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
