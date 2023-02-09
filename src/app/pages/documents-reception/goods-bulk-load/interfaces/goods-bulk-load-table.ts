export interface IGoodsBulkLoadExampleData {
  noBien: string | number;
  description: string | number;
  cantidad: string | number;
  ident: string | number;
  est: string | number;
  proceso: string | number;
}

export interface previewData {
  expediente?: string; // expediente;
  volante?: string; // volante;
  bien?: string; // bien;
  col1?: string; // descripcion;
  col2?: string; // cantidad;
  col3?: string; // unidad;
  col4?: string; // estatus;
  col5?: string; // identificador;
  col6?: string; // clasificacion;
  col7?: string; // expediente;
  sat_id_transferencia?: string; // sat_id_transferencia;
  sat_cve_unica?: string; // sat_cve_unica;
  col8?: string; // bloque;
  col9?: string; // lote;
  col10?: string; // val1;
  col11?: string; // val2;
  col12?: string; // val3;
  col13?: string; // val4;
  col14?: string; // val5;
  col15?: string; // val6;
  col16?: string; // val7;
  col17?: string; // val8;
  col18?: string; // val9;
  col19?: string; // val10;
  col20?: string; // val11;
  col21?: string; // val12;
  col22?: string; // val13;
  col23?: string; // val14;
  col24?: string; // val15;
  col25?: string; // val16;
  col26?: string; // val17;
  col27?: string; // val18;
  col28?: string; // val19;
  col29?: string; // val20;
  col30?: string; // val21;
  col31?: string; // val22;
  col32?: string; // val23;
  col33?: string; // val24;
  col34?: string; // val25;
  col35?: string; // val26;
  col36?: string; // val27;
  col37?: string; // val28;
  col38?: string; // val29;
  col39?: string; // val30;
  col40?: string; // val31;
  col41?: string; // val32;
  col42?: string; // val33;
  col43?: string; // val34;
  col50?: string; // observaciones;
  val49?: string; // '';
  val50?: string; // '';
}

/**
 * SAT_SAE
 */
// PROCESO 1 ---- CARINSBIENES
export interface SatSaeInsertGoods {
  expediente: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  status: string;
  identificador: string;
  clasif: number;
}
// PROCESO 2 ----- CARINSMENAJE
export interface SatSaeInsertMenaje {
  cantidad: number;
  clasif: number;
  descripcion: string;
  expediente: number;
  identificador: string;
  nobienmenaje: number;
  status: string;
  unidad: string;
}
// PROCESO 3 ---- CARINSNOTIF_INMUEBLES
export interface SatSaeNotificacionInmuebles {
  areadestino: number;
  asunto: number;
  calle: string;
  cantidad: number;
  ciudad: number;
  clasif: number;
  colonia: string;
  contribuyente: number;
  descbien: string;
  descripcion: string;
  destinatario: string;
  entfed: number;
  estado: string;
  exptrans: string;
  fecoficio: number;
  gestiondestino: string;
  identificador: string;
  municipio: string;
  nooficio: string;
  remitente: string;
  solicitante: number;
  status: string;
  tipovolante: string;
  transferente: number;
  unidad: string;
  viarecepcion: number;
}
// PROCESO 4 ---- CARINSNOTIF_MUEBLES
export interface SatSaeNotificacionMuebles {
  areadestino: number;
  asunto: number;
  cantidad: number;
  ciudad: number;
  clasif: number;
  contribuyente: number;
  descbien: string;
  descripcion: string;
  destinatario: string;
  entfed: number;
  exptrans: string;
  fecoficio: number;
  gestiondestino: string;
  identificador: string;
  marca: string;
  nooficio: string;
  remitente: string;
  serie: string;
  solicitante: number;
  status: string;
  tipovolante: string;
  transferente: number;
  unidad: string;
  viarecepcion: number;
}
