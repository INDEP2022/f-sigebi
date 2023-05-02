const EXPEDIENTE_ERROR_DATA = (fileNumber: number) =>
  `El número de expediente "${fileNumber}" NO EXISTE`;
const EXPEDIENTE_EMPTY_DATA = `Error al cargar los datos del Expediente`;
const EXPEDIENTE_INCORRECTO_TEXT = `Número de Expediente Incorrecto`;
const EXPEDIENTE_INCORRECTO_TITLE = `Es necesario ingresar un número de Expediente VALIDO para continuar.`;
const ERROR_AREA_DESTINO_DATA = (departamentDestinyNumber: number) =>
  `PROBLEMAS AL CARGAR LA DESCRIPCIÓN DEL ÁREA DESTINO: "${departamentDestinyNumber}".`;
const ERROR_ASUNTO_DATA = (affairKey: number) =>
  `PROBLEMAS AL CARGAR LA DESCRIPCIÓN DEL ASUNTO: "${affairKey}".`;
const EXPEDIENTE_NOTIFICACIONES_ERROR_DATA = (fileNumber: number) =>
  `${EXPEDIENTE_ERROR_DATA(fileNumber)} en Notificaciones`;

export {
  EXPEDIENTE_INCORRECTO_TEXT,
  EXPEDIENTE_INCORRECTO_TITLE,
  EXPEDIENTE_EMPTY_DATA,
  EXPEDIENTE_ERROR_DATA,
  ERROR_AREA_DESTINO_DATA,
  ERROR_ASUNTO_DATA,
  EXPEDIENTE_NOTIFICACIONES_ERROR_DATA,
};
