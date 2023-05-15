const ERROR_GOOD_NULL = `Ingresa un número de Bien válido`;
const NOT_FOUND_GOOD = (error: string) =>
  `Error al cargar la información del Bien. ${error}`;
const ERROR_GOOD_REPORT = `Realice la búsqueda del Bien para continuar ya que el número de Bien es requerido para generar el reporte`;
const ERROR_REPORT = `Reporte no disponible por el momento`;

export { ERROR_GOOD_NULL, NOT_FOUND_GOOD, ERROR_GOOD_REPORT, ERROR_REPORT };
