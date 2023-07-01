export interface INotary {
  id?: number;
  nombre: string;
  valido: string;
  no_notaria: number;
  ubicacion: string;
  domicilio: string;
  telefono: string;
  correo: string;
  no_registro: number;
}

export interface IComerNotariostercs {
  id: number;
  name: string | null;
  lastName: string | null;
  motherLastName: string | null;
  businessName: string | null;
  physicalRfc: string | null;
  moralRdc: string | null;
  phone: string | null;
  email: string;
}
