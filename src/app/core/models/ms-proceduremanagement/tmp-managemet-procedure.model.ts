import { IProceduremanagement } from './ms-proceduremanagement.interface';

export interface ITmpManagementProcedure {
  id: string;
  officenumber: string;
  InvoiceRep: string;
  usrturned: string;
  areaToTurn: string;
  management: IProceduremanagement;
}
