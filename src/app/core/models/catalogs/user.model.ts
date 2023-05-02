export interface IUser {
  id?: number;
  user: string;
  email: string;
  userCharge: string;
  charge: UserCharge;
}

export interface UserCharge {
  description: string;
}
