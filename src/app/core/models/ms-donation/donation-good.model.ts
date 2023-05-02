export interface ISendRequest {
  busWarehouseNumber: number;
  coordinationNumber: number;
  donationId: number;
  donationType: string;
}

export interface ISendRequestProposal {
  donationType: string;
  doneeId: number;
  storeNumber: number;
  requestId: number;
}

export interface IRequestDonation {
  advanceProp: string;
  donationType: string;
  doneeId: number;
  storeNumber: number;
  requestId: number;
}

export interface IDonationGoodRequest {
  id_donatario: string;
  donatario: string;
  no_almacen: string;
  desc_almacen: string;
  avance_propu: string;
  cve_autoriza: string;
  fec_autoriza: any;
  id_solicitud: string;
  a: string;
}

export interface IDonationPropolsal {
  cve_propuesta: string;
  id_solicitud: number;
  no_bien: number;
  no_expediente: number;
  cantidad: number;
  sol_cantidad: any;
  cantidad_asig: number;
  no_clasif_bien: number;
  desc_clasif_bien: string;
  descripcion: string;
  del_admin: string;
}
