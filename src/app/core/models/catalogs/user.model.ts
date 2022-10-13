import { IChargeUser } from "./charge-user";

export interface IUser {
    id?:number;
    user: string;
    email: string;
    userCharge: IChargeUser;
}