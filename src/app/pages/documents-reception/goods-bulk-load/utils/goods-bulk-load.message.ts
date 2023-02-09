const FORM_IDENTIFICATOR_NULL =
  'Este proceso masivo requiere de un ID. de Carga.';
const FORM_ACTION_TYPE_NULL =
  'Este proceso masivo requiere de una opción de Carga.';
const FORM_ACTION_TYPE_WITH_CHECK_ERROR = (opcion: string) =>
  `Este proceso masivo requiere de la opción de Carga.: ${opcion}. ya que se selecciono "INMUEBLES" y/o "AUTOMÓVILES"`;
const NOT_LOAD_FILE = 'Carga un archivo excel válido para continuar.';
const ERROR_CARGA_MASIVA =
  'Se encontraron errores de datos durante la validación.';
const VALIDATION_START_MESSAGE = 'Iniciando proceso de Validación de Datos...';
const VALIDATION_PROCESS_MESSAGE = (numero_registro: number) =>
  `Válidando el registro: ${numero_registro}.`;
const VALIDATION_END_MESSAGE = 'Proceso de Validación de Datos Terminado.';
const ERROR_EXPORT = 'No existen registros para exportar.';
// PROCESOS
const ERROR_UNIDAD = (unidad: string) =>
  `La cantidad es inválida. En el campo UNIDAD: ${unidad}.`;
const ERROR_ESTATUS = (estatus: string) =>
  `El estatus ${estatus} no existe en el sistema.`;
// PROCESO 1 Y PROCESO 3
const ERROR_CLASS_GOOD = (class_good: number) =>
  `El número de clasificación del bien ${class_good} no existe en el sistema.`;
const ERROR_UNITY_CLASS_GOOD = (unity: string, class_good: number) =>
  `No existe la unidad ${unity} para el número de clasificación del bien ${class_good} en el sistema.`;
// PROCESO 2
const ERROR_IDENTIFICADOR_MENAJE = (identificador: string) =>
  `Falta el número de bien padre menaje: ${identificador}.`;
// PROCESO 4
const ERROR_TRANSFERENTE = (transferente: string) =>
  `No existe la transferente, emisora y autoridad para la clave indicada: ${transferente}.`;
const ERROR_ATRIBUTE_CLASS_GOOD = (class_good: number) =>
  `El atributo no pudo ser cargado para el clasificador del bien: ${class_good}.`;

export {
  FORM_IDENTIFICATOR_NULL,
  ERROR_CARGA_MASIVA,
  VALIDATION_START_MESSAGE,
  FORM_ACTION_TYPE_NULL,
  NOT_LOAD_FILE,
  ERROR_UNIDAD,
  ERROR_ESTATUS,
  ERROR_CLASS_GOOD,
  ERROR_UNITY_CLASS_GOOD,
  ERROR_IDENTIFICADOR_MENAJE,
  ERROR_TRANSFERENTE,
  ERROR_ATRIBUTE_CLASS_GOOD,
  FORM_ACTION_TYPE_WITH_CHECK_ERROR,
  ERROR_EXPORT,
  VALIDATION_PROCESS_MESSAGE,
  VALIDATION_END_MESSAGE,
};
