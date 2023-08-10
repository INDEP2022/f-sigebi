import { ISegUsersNonRelational } from '../ms-users/seg-user-non-relational.model';

export interface ISegProfile {
  profile: string;
  description: string;
  registerNumber: number;
}

export interface ISegProfileAccessScreen {
  screenKey: string;
  user: ISegUsersNonRelational;
  readingPermission: string;
  writingPermission: string;
}
