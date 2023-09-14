export interface IEmail {
  files: string;
  emails_send: string;
  user: string;
  template: string;
  emails_cc: string;
  subject: string;
}

export interface IVigEmailBody {
  id: string;
  bodyEmail: string;
  subjectEmail: string;
  status: string;
}

export interface IVigEmailSend {
  id: string;
  emailSend: string;
  nameSend: string;
  postSend: string;
  status: string;
}

export interface IVigMailBook {
  id: string;
  bookName: string;
  bookEmail: string;
  bookType: string;
  delegationNumber: string;
  bookStatus: string;
  delegationDetails?: {
    id: string;
    etapaEdo: string;
    stateKey: string;
    description: string;
    addressOffice: string;
    // otras propiedades
  };
}

export interface IVigMailGeneric {
  recipients: string;
  cc: string;
  bcc: string;
  subject: string;
  message: string;
  typeText: number;
  mailOrigin: string;
}
