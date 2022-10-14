//Interface Provisional sin Validar
export interface IEvent {
  id?: number;
  typeEventId: number;
  statusSaleId: string;
  keyProcess: string;
  observations: string;
  address: string;
  failureDate: Date;
  location: string;
  eventDate: Date;
  text1: string;
  text2: string;
  signer: string;
  positionSigner: string;
  notes: string;
  endText3: string;
  endText4: string;
  baseCost: string;
  baseNumberSold: string;
  user: string;
  month: number;
  year: number;
  delegationNumber: number;
  inmuPhase: number;
  thirdPartyId: string;
  notificationDate: string;
  closingDate: string;
  tpsolavalId: string;
  aplica_iva: number;
  trial919: string;
}
