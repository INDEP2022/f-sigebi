export interface IConcept {
  id: string;
  description: string;
  routineCalculation?: any;
  automatic?: any;
  address: string;
  numerary: string;
}

export interface IConceptCopy {
  parametro: string;
  descripcion: string;
  valor: string;
  id_concepto: number;
  current_date: string;
  direccion: string;
}
