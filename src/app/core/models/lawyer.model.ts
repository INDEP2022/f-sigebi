import { IOffice } from './office.model';

export interface ILawyer {
  id: number | null;
  idOffice: IOffice;
  name: string;
  street: string | null;
  streetNumber: string | null;
  apartmentNumber: number | null;
  suburb: string | null;
  delegation: string | null;
  zipCode: number | null;
  rfc: string | null;
  phone: string | null;
  registerNumber: number | null;
}
