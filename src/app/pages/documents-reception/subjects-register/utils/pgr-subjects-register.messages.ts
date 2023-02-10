const ERROR_INTERNET = 'Revise su conexión de Internet.';
const NOT_FOUND_MESSAGE = (nameConsult: string) =>
  `No existen resultados para ${nameConsult}`;
const ERROR_FORM = 'Completa los campos correctamente.';
const ERROR_EXPORT = 'No existen registros para exportar.';
const ERROR_FORM_FECHA =
  'La fecha de inicio debe ser menor o igual a la fecha final.';
const INFO_DOWNLOAD = (buttonName: string, buttonNameAll: string) =>
  `Para descargar únicamente los registros mostrados en la tabla da clic en "${buttonName}"`; // y para exportar todos los registros de la búsqueda da clic en "${buttonNameAll}"`;

export {
  ERROR_INTERNET,
  NOT_FOUND_MESSAGE,
  ERROR_FORM,
  ERROR_FORM_FECHA,
  ERROR_EXPORT,
  INFO_DOWNLOAD,
};
