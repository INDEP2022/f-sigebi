export interface IGoodSpent {
  no_bien: string;
  descripcion: string;
  no_expediente: string;
  estatus: string;
  cantidad: string;
  cvman: string;
  clave: string;
  id_solicitudpago: string;
  nombreprov: string;
  // TODO: solicitar cambiar el nombre de la columna
  '?column?': string;
  no_factura_rec: string;
  to_char: string;
  nom_empl_solicita: string;
  nom_empl_autoriza: string;
  nom_empl_captura: string;
}
