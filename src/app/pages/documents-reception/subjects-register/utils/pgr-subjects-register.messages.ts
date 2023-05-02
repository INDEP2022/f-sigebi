const ERROR_INTERNET = 'Revise su conexión de Internet.';
const NOT_FOUND_MESSAGE = (nameConsult: string) =>
  `No existen resultados para ${nameConsult}`;
const ERROR_FORM = 'Completa los campos correctamente.';
const ERROR_FORM_NOT_INSERT =
  'Completa al menos un campo de la busqueda para continuar.';
const ERROR_FORM_SEARCH_OFICIO_AVERIGUACION_PREVIA =
  'Buscando transferencias FGR por Oficio FGR y Averiguación Previa.';
const ERROR_FORM_SEARCH_OFICIO_PGR =
  'Buscando transferencias FGR por Oficio FGR.';
const ERROR_FORM_SEARCH_AVERIGUACION_PREVIA =
  'Buscando transferencias FGR por Averiguación Previa.';
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
  ERROR_FORM_SEARCH_OFICIO_AVERIGUACION_PREVIA,
  ERROR_FORM_SEARCH_OFICIO_PGR,
  ERROR_FORM_SEARCH_AVERIGUACION_PREVIA,
  ERROR_FORM_NOT_INSERT,
  DOWNLOAD_PROCESS,
};
