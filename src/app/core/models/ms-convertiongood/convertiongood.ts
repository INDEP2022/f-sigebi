export interface IConvertiongood {
  id?: number;
  fileNumber?: /* IExpedient | number */ any;
  goodFatherNumber: string | number;
  pageDocto?: string;
  fCreate: Date;
  fConversions?: Date;
  hourConv?: string;
  fInvitation?: string;
  hourInv?: string;
  fNotification?: Date;
  respConv?: string;
  respCharge?: string;
  witnessOic?: string;
  tOicCharge?: string;
  witness2?: string;
  witness3?: string;
  minutesErNumber?: string;
  cveActaConv?: string;
  pageEscConv?: string;
  statusConv?: string | number;
  noRegister?: string | number;
  addressedTo?: string;
  address?: string;
  atte?: string;
  ccp1?: string;
  chargeCcp1?: string;
  ccp2?: string;
  chargeCcp2?: string;
  ccp3?: string;
  chargeCcp3?: string;
  ccp4?: string;
  chargeCcp4?: string;
  ccp5?: string;
  chargeCcp5?: string;
  fecActaEr: Date;
  typeConv: string | number;
  pwAccess: string;
}

export class IActasConversion {
  cve_acta_conv: number | string;
  tipo_acta: string;
  emisora: string;
  administra: string;
  ejecuta: string;
  folio_universal: string;
  parrafo1: string;
  parrafo2: string;
  parrafo3: string;
  no_registro: string;
  nb_origen: string;
}
