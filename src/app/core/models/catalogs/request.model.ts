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
  priority?: boolean;
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
}
