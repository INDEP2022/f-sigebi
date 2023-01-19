const NO_PARAMETER_FOUND =
  'No se tiene definido en PARAMETROS la clasificacion para numerario-efectivo';
const TRANSFER_NULL_RECIVED = 'La transferente no existe';
const ONLY_CAN_CAPTURE_MOVABLE_GOODS =
  'Para esta transferente solamente se pueden capturar muebles';
const ONLY_CAN_CAPTURE_INMOVABLE_GOODS =
  'Para esta transferente solamente se pueden capturar muebles';
const GOOD_TYPE_NOT_FOUND = (type: string) =>
  `No existe el ${type} de bien, consulte la lista`;
const COMPENSATION_GOOD_ALERT = 'El nuevo bien es de Resarcimiento';
const NO_CLASIF_NUMBER_NOT_FOUND =
  'No se encontraron datos del clasificador de bien';
const EXPEDIENT_NOT_FOUND = 'El expediente no existe, por favor verifique';
const EXPEDIENT_IS_SAT =
  'El expediente pertenece a un trámite SAT-SAE y por regla de negocio no se pueden agregar más bienes a los transferidos por SAT.';
export {
  NO_PARAMETER_FOUND,
  TRANSFER_NULL_RECIVED,
  ONLY_CAN_CAPTURE_MOVABLE_GOODS,
  GOOD_TYPE_NOT_FOUND,
  ONLY_CAN_CAPTURE_INMOVABLE_GOODS,
  COMPENSATION_GOOD_ALERT,
  EXPEDIENT_IS_SAT,
  NO_CLASIF_NUMBER_NOT_FOUND,
  EXPEDIENT_NOT_FOUND,
};
