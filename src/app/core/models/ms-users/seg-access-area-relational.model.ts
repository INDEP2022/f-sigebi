import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { ISegUsersNonRelational } from './seg-user-non-relational.model';

export interface IUserAccessAreaRelational {
  delegationNumber: number;
  subdelegationNumber: number;
  departamentNumber: number;
  user: string;
  assigned: string;
  registryNumber?: number;
  delegation1Number: number;
  departament1Number: number;
  lastActive: number;
  delegation: null | IDelegation;
  subDelegation: null | ISubdelegation;
  departament: null | IDepartment;
  userDetail: ISegUsersNonRelational;
  userAndName?: string;
}
