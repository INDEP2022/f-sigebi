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
// Interface para
export interface previewDataGeneral {
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col5?: string;
  col6?: string;
  col7?: string;
  col8?: string;
  col9?: string;
  col10?: string;
  col11?: string;
  col12?: string;
  col13?: string;
  col14?: string;
  col15?: string;
  col16?: string;
  col17?: string;
  col18?: string;
  col19?: string;
  col20?: string;
  col21?: string;
  col22?: string;
  col23?: string;
  col24?: string;
  col25?: string;
  col26?: string;
  col27?: string;
  col28?: string;
  col29?: string;
  col30?: string;
  col31?: string;
  col32?: string;
  col33?: string;
  col34?: string;
  col35?: string;
  col36?: string;
  col37?: string;
  col38?: string;
  col39?: string;
  col40?: string;
  col41?: string;
  col42?: string;
  col43?: string;
  expediente?: string;
  volante?: string;
  bien?: string;
  val1?: string;
  val2?: string;
  val3?: string;
  val4?: string;
  val5?: string;
  val6?: string;
  val7?: string;
  val8?: string;
  val9?: string;
  val10?: string;
  val11?: string;
  val12?: string;
  val13?: string;
  val14?: string;
  val15?: string;
  val16?: string;
  val17?: string;
  val18?: string;
  val19?: string;
  val20?: string;
  val21?: string;
  val22?: string;
  val23?: string;
  val24?: string;
  val25?: string;
  val26?: string;
  val27?: string;
  val28?: string;
  val29?: string;
  val30?: string;
  val31?: string;
  val32?: string;
  val33?: string;
  val34?: string;
  val35?: string;
  val36?: string;
  val37?: string;
  val38?: string;
  val39?: string;
  val40?: string;
  val41?: string;
  val42?: string;
  val43?: string;
  val44?: string;
  val45?: string;
  val46?: string;
  val47?: string;
  val48?: string;
  val49?: string;
  val50?: string;
  valida_status?: string;
  num?: string;
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

export interface pgrDataView {
  tipovolante: string | number; //COL1
  remitente: string | number; //COL2
  identificador: string | number; //COL3
  asunto: string | number; //COL4
  nooficio: string | number; //COL5
  fecoficio: string | number; //COL6
  exptrans: string | number; //COL7
  descripcion: string | number; //COL8
  ciudad: string | number; //COL9
  entfed: string | number; //COL10
  solicitante: string | number; //COL11
  contribuyente: string | number; //COL12
  transferente: string | number; //COL13
  viarecepcion: string | number; //COL14
  areadestino: string | number; //COL15
  gestiondestino: string | number; //COL16
  destinatario: string | number; //COL17
  descbien: string | number; //COL18
  cantidad: string | number; //COL19
  unidad: string | number; //COL20
  status: string | number; //COL21
  clasif: string | number; //COL22
  marca: string | number; //COL30
  serie: string | number; //COL35
}
