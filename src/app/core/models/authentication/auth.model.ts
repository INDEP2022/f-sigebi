export interface AuthModel {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface RealmAccessModel {
  roles: string[];
}

export interface ResourceAccessModel {
  'realm-management': RealmAccessModel;
  'indep-auth': RealmAccessModel;
  account: RealmAccessModel;
}
