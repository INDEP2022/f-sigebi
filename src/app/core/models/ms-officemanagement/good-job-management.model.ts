import { IGood } from '../ms-good/good';

export interface IGoodJobManagement {
  managementNumber?: string;
  goodNumber?: IGood;
  recordNumber?: string;
}
export interface IGoodJobManagementByIds {
  managementNumber?: string;
  goodNumber?: number;
  recordNumber?: string;
}
