export interface IDictation {
  id: number; //no_of_dicta
  passOfficeArmy: string; //clave_oficio_armada
  expedientNumber: string; //no_expediente
  typeDict: string; //tipo_dictaminacion
  statusDict: string; //estatus_dictaminacion
  dictDate: string; // fec_dictaminacion
  userDict: string; //usuario_dictamina
  observations?: null; //observaciones
  delegationDictNumber: string; //no_delegacion_dictam
  areaDict: string; //area_dictamina
  instructorDate: string; //fecha_instructora
  registerNumber: string; //no_registro
  esDelit?: null; //es_delit
  wheelNumber: string; //no_volante
  keyArmyNumber: string; //num_clave_armada
  notifyAssuranceDate?: null; // fec_notifica_aseguramiento
  resolutionDate?: null; //fec_resolucion
  notifyResolutionDate?: null; //fec_notificaresolucion
  folioUniversal?: null; //folio_universal
  entryDate?: null; //fec_ingreso
  dictHcDAte?: null; // fec_dictaminacion_hc
  entryHcDate?: null; //fec_ingreso_hc
}
