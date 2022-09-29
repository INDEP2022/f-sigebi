import { ICity } from './city.model';

export interface IMinpub {
  id?: number;
  descripcion: string;
  responsable: string;
  calle: string;
  no_interior: string;
  no_exterior: string;
  colonia: string;
  codigo_postal: number;
  deleg_munic: string;
  no_ciudad: number | ICity;
  telefono: string;
  no_registro: number;
}
