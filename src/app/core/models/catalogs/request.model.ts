export interface IRequest {
  date?: Date;
  noOfi?: string;
  regDelega?: string;
  entity?: string;
  tranfe?: string;
  transmitter?: string;
  authority?: string;
  typeUser?: string;
  receiUser?: string;
  noExpedient?: string;
  typeExpedient?: string;
  noRequest?: string;

  //
  responsible?: string;

  //Reception Requests
  priority?: any;
  infoProvenance?: string;
  receptDate?: string;
  officeDate?: Date;
  //typeExpedient?: string;
  indiciado?: string;
  nameSender?: string;
  publicMinister?: string;
  roleSender?: string;
  tribunal?: string;
  phoneSender?: number;
  crime?: string;
  emailSender?: string;
  typeReception?: string;
  sender?: string;
  destinationManage?: string;
  contributor?: string;
  subject?: string;
  transExpedient?: number;
  typeTransfer?: string;
  transferEntityNotes?: string;
  observations?: string;

  //solicitud del expediente
  status?: string;

  assetsDescripTransfer?: string;
  assetsDescripSEA?: string;
  typeAsset?: string;
  fraction?: string;
  quantityTransfer?: string;
  ligieUnitMeasure?: string;
  transferUnitMeasure?: string;
  uniqueKey?: string;
  physicalState?: string;
  conservationState?: string;
  destinyLigie?: string;
  destinyTransfer?: string;
}
