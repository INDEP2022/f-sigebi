export interface IUser {
  id?: number;
  user?: string;
  email?: string;
  userCharge?: string;
  charge?: UserCharge;
}

export interface UserCharge {
  description: string;
}

export interface IUserInfo {
  sub: string;
  delegacionreg: string;
  employeetype: string;
  email_verified: boolean;
  siglasnivel1: string;
  siglasnivel2: string;
  siglasnivel3: string;
  siglasnivel4: string;
  preferred_username: string;
  given_name: string;
  title: string;
  jefeinmed: string;
  puesto: string;
  cargonivel4: string;
  cargonivel3: string;
  cargonivel2: string;
  pager: number;
  cargonivel1: string;
  name: string;
  department: number;
  family_name: string;
  email: string;
  username: string;
}
