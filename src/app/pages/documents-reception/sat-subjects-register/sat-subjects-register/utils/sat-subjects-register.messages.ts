const ERROR_INTERNET = 'Revise su conexión de Internet.';
const NOT_FOUND_MESSAGE = (nameConsult: string) =>
  `No existen resultados para ${nameConsult}`;
const ERROR_FORM = 'Completa los campos correctamente.';
const ERROR_FORM_NOT_INSERT =
  'Completa al menos un campo de la busqueda para continuar.';
const ERROR_FORM_SEARCH_OFICIO_EXPEDIENTE_SAT =
  'Buscando transferencias SAT por Oficio SAT y Expediente SAT.';
const ERROR_FORM_SEARCH_OFICIO_SAT =
  'Buscando transferencias SAT por Oficio SAT.';
const ERROR_FORM_SEARCH_EXPEDIENTE_SAT =
  'Buscando transferencias SAT por Expediente SAT.';
const ERROR_EXPORT = 'No existen registros para exportar.';
const ERROR_FORM_FECHA =
  'La fecha de inicio debe ser menor o igual a la fecha final.';
const INFO_DOWNLOAD = (buttonName: string, buttonNameAll: string) =>
  `Para descargar únicamente los registros mostrados en la tabla da clic en "${buttonName}" y para exportar hasta 20 000 (Veinte Mil) registros de la búsqueda da clic en "${buttonNameAll}"`;
const DOWNLOAD_PROCESS = 'Espere un momento... Descargando su reporte.';

export {
  ERROR_INTERNET,
  NOT_FOUND_MESSAGE,
  ERROR_FORM,
  ERROR_FORM_FECHA,
  ERROR_EXPORT,
  INFO_DOWNLOAD,
  ERROR_FORM_NOT_INSERT,
  ERROR_FORM_SEARCH_OFICIO_EXPEDIENTE_SAT,
  ERROR_FORM_SEARCH_OFICIO_SAT,
  ERROR_FORM_SEARCH_EXPEDIENTE_SAT,
  DOWNLOAD_PROCESS,
};
