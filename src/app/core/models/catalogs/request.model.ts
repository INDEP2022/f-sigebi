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

    //Reception Requests
    priority?:boolean;
    InfoReception?:string;
    receptDate?: Date;
    officeDate?: Date;
    //typeExpedient?: string;
    indiciado?: string;
    nameSender?: string;
    publicMinister?: string;
    roleSender?: string;
    tribunal?: string
    phoneSender?:string;
    crime?: string;
    emailSender?: string;
    typeReception?: string;
    sender?: string;
    destinationManage?: string;
    contributor?:string;
    subject?: string
    transferExpedient?:number;
    typeTransfer?: string;
    transferEntityNotes?:string;
    Observations?: string;
}


