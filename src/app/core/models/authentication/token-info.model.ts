import { RealmAccessModel, ResourceAccessModel } from './auth.model';

export interface TokenInfoModel {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: RealmAccessModel;
  resource_access: ResourceAccessModel;
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  department: string;
  employeetype: string;
  puesto: string;
  username: string;
  cargonivel1: string;
  cargonivel2: string;
  cargonivel3: string;
  siglasnivel1: string;
  siglasnivel2: string;
  siglasnivel3: string;
  siglasnivel4: string;
}
