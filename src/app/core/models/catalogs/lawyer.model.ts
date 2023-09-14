import { IOffice } from './office.model';

export interface ILawyer {
  id: number | null;
  idOffice: number;
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
  officeDetails?: string | IOffice;
}

/*export interface IOfficeDetails{
  id: 26,
  name: Prueba QA,
  street: Calle,
  noExt: 1,
  noInt: null,
  colony: DER,
  municipalDelegate: DER,
  postalCode: 91140,
  rfc: leea881101ad9,
  phone: 223344,
  phoneTwo: 3344,
  fax: null,
  typeOffice: S,
  noRegistration: null
}*/
