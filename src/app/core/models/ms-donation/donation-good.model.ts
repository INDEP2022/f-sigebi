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

export interface IDonacContract {
  id: string;
  contractKey: string;
  representativeSae: string;
  granteeId: string;
  elaborationDate: Date;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  paragraph5: string;
  fecsession: string;
  agreementsSes: string;
  sessionNumber: string;
  job: string;
  fecJob: string;
  home: string;
  witness1: string;
  witness2: string;
  contractStatus: string;
  folioScan: string;
  observations: string;
  scanDate: Date;
  puetsosae: string;
  usersae: string;
  positionDona: string;
  nomrepdona: string;
  requestId: string | number;
  donee?: string | number;
  typeDonac?: number;
  justification?: string;
  requestDate?: Date;
  authorizeKey?: string;
  authorizeDate?: Date;
  don?: string; /// Esta es el acta
  razonSocial?: string;
  descDonatario?: string;
  estado?: string;
  municipio?: string;
}
