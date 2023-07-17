export interface IPupUser {
  departament: string;
  descriptiondepartament: string;
  delegation: string;
  descriptiondelegation: string;
  subdelegation: string;
  subdelegationdescription: string;
  nameuser: string;
}

export interface IUsersTracking {
  user: string;
  name: string;
  rfc: string;
  curp: string;
  street: string;
  insideNumber: string;
  cologne: string;
  postalCode: number;
  phone: string;
  profession: string;
  postKey: string;
  incomeFirstTimeDate: string;
  validityPasswordDays: number;
  lastChangePasswordDate: string;
  passwordUpdate: string;
  recordNumber: number;
  mail: string;
  sirsaeUser: string;
  mailSend: number;
  attributesAssingns: number;
  sirsaeClkdet: number;
  aliasExchange: string;
  clkdet: number;
  clkid: string;
  profilemimKey: string;
  yamad: string;
  postbeforeKey: string;
  originNb: string;
}

export interface IAccesTrackingXArea {
  delegationNumber: number;
  subdelegationNumber: number;
  departmentNumber: number;
  user: string;
  assigned: string;
  recorNumber: number;
  delegate1Number: number;
  department1Number: number;
  lastAsset: number;
}

export interface Iuser {
  usuario: string;
  nombre: string;
  cve_cargo: number;
  otvalor: string;
  no_delegacion: number;
}

export interface ITrackingAcces {
  screenKey: string;
  user: IUsersTracking;
  readingPermission: string;
  writingPermission: string;
  recordNumber: string;
  modulowebId: string;
  originNb: string;
}
