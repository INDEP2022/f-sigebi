import { RealmAccessModel } from './auth.model';

export interface RolesInfoModel {
  usuario: [
    {
      creation: string;
      deleted: boolean;
      email: string;
      externalnumber: number;
      facebook: string;
      id: number;
      ine: string;
      instagram: string;
      internalnumber: number;
      lastmodified: string;
      lastsurname: string;
      mobile: number;
      name: string;
      phone: string;
      phonework: string;
      postalcode: number;
      roles: RealmAccessModel;
      secondName: string;
      socialsecurity: string;
      street: string;
      surname: string;
      twitter: string;
      type: number;
      uid: string;
    }
  ];
}
