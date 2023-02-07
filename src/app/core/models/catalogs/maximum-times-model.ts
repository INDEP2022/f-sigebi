export interface IMaximumTimes {
  certificateType: string;
  date: Date;
  tmpMax: number;
  activated: string;
  user: string | IUsers;
}
export interface IUsers {
  attribAsign: string;
  clkdet: number;
  clkdetSirsae: string;
  clkid: string;
  curp: string;
  daysValidityPass: number;
  email: string;
  exchangeAlias: string;
  firstTimeLoginDate: string;
  id: string;
  insideNumber: number;
  name: string;
  nameAd: null;
  passLastChangeDate: string;
  passUpdate: string;
  phone: number;
  posPrevKey: string;
  positionKey: string;
  profession: string;
  profileMimKey: string;
  registryNumber: number;
  rfc: string;
  sendEmail: string;
  street: string;
  suburb: string;
  userSirsae: string;
  zipCode: number;
}
