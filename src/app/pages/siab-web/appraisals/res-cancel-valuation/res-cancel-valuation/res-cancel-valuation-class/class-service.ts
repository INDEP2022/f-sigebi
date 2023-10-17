export class SendObtainGoodValued {
  idEventIn: any;
  tpJobIn: any;
  idJobIn: any;
}

export class ValidationResponseFile {
  description: any;
  descriptionTypeOffice: any;
  typeOffice: any;
  address: any;
}

export class OfficesSend {
  eventId: number;
  officeType: number;
}

export class MyBody {
  level1: string;
  level2: string;
  level3: string;
  officeCode: string;
  subject: string;
  recipient: string;
  recipientPosition: string;
  cityName: string;
  sendDate: string;
  text1: string;
  text2: string;
  text3: string;
  sender: string;
  senderPosition: string;
  goodsList: string;
  usersWithCopy: string[];
  electronicSignature: string;
  goodsDataTable: any;
  recipientsDataTable: any;
}

export class UserFind {
  flagIn: number;
}
