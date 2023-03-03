const FORM_IDENTIFICATOR_NULL =
  'Este proceso masivo requiere de un ID. de Carga.';
const FORM_ACTION_TYPE_NULL =
  'Este proceso masivo requiere de una opción de Carga.';
const FORM_INMUEBLES_MUEBLES_CHECK = (autos: string, inmuebles: string) =>
  `No es posible realizar carga masiva de "${autos}" y "${inmuebles}" al mismo tiempo. Selecciona sólo una de las opciones a la vez.`;
const FORM_ACTION_TYPE_WITH_CHECK_ERROR = (opcion: string) =>
  `Este proceso masivo requiere de la opción de Carga.: ${opcion}. ya que se selecciono "INMUEBLES" y/o "AUTOMÓVILES"`;
const NOT_LOAD_FILE = 'Carga un archivo excel válido para continuar.';
const ERROR_CARGA_MASIVA =
  'Se encontraron errores de datos durante la validación.';
const VALIDATION_START_MESSAGE = 'Iniciando proceso de Validación de Datos...';
const VALIDATION_PROCESS_MESSAGE = (numero_registro: number) =>
  `Válidando el registro: ${numero_registro}.`;
const VALIDATION_END_MESSAGE = 'Proceso de Validación de Datos Terminado.';
const VALIDATION_UPLOAD_START_MESSAGE =
  'Iniciando proceso de Carga de Datos...';
const VALIDATION_UPDATE_PROCESS_MESSAGE = (numero_registro: number) =>
  `Cargando el registro: ${numero_registro}.`;
const ERROR_EXPORT = 'No existen registros para exportar.';
const VALIDATION_UPLOAD_CREATION_EXPEDIENTE_MESSAGE = 'Creación de Expediente.';
const VALIDATION_UPLOAD_GENERATION_EXPEDIENTE_MESSAGE =
  'Generación de Expediente.';
// PROCESOS VALIDACION
const ERROR_UNIDAD = (unidad: string) =>
  `La cantidad es inválida. En el campo UNIDAD: ${unidad}.`;
const ERROR_CANTIDAD = (cantidad: string) =>
  `La cantidad es inválida. En el campo CANTIDAD: ${cantidad}.`;
const ERROR_ESTATUS = (estatus: string) =>
  `El estatus ${estatus} no existe en el sistema.`;
const ERROR_ESTATUS_GENERAL = (numero_registro: number) =>
  `No se realizo la inserción del bien con la posición "${numero_registro}" debido a que no se permiten inserciones con estatus diferente de "ROP" .`;
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
  `No existe el transferente, emisora y autoridad para la clave indicada: ${transferente}.`;
const ERROR_ATRIBUTE_CLASS_GOOD = (class_good: number) =>
  `El atributo no pudo ser cargado para el clasificador del bien: ${class_good}.`;
// CARGA PROCESO
const ERROR_CVE_SAT = (cve_sat: number) =>
  `No se encontro SAT_CVE_UNICA: ${cve_sat}.`;
// PROCESO 2
const ERROR_GOOD_INMUEBLE = (good_number: string) =>
  `No se encontraron datos del bien inmueble: ${good_number}.`;
// PROCESO 4
const ERROR_EXPEDIENTE = (expedient: string) =>
  `No se encontro el expediente en el documento: ${expedient}.`;
const ERROR_CITY_ASUNTO_SAT = (asunto_sat: string) =>
  `No se encontro la clave de la ciudad filtrada por el asunto SAT: ${asunto_sat}.`;
const ERROR_GET_CLAVE_SAT = (descripcion: string) =>
  `No se encontro SAT_CVE_UNICA de: ${descripcion}.`;
const ERROR_ISSUING_INSTITUTION = (cveIssuing: string) =>
  `No se encontro la institución emisora: ${cveIssuing}.`;
const ERROR_TRANSFERENTE_PARAMS = (contador: number) =>
  `${
    contador == 0
      ? 'No existe el transferente, emisora y autoridad.'
      : 'Demasiadas transferentes, emisoras y autoridades coinciden.'
  }.`;

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
  FORM_INMUEBLES_MUEBLES_CHECK,
  VALIDATION_UPLOAD_START_MESSAGE,
  VALIDATION_UPDATE_PROCESS_MESSAGE,
  ERROR_CVE_SAT,
  ERROR_GOOD_INMUEBLE,
  VALIDATION_UPLOAD_CREATION_EXPEDIENTE_MESSAGE,
  VALIDATION_UPLOAD_GENERATION_EXPEDIENTE_MESSAGE,
  ERROR_EXPEDIENTE,
  ERROR_CITY_ASUNTO_SAT,
  ERROR_GET_CLAVE_SAT,
  ERROR_ISSUING_INSTITUTION,
  ERROR_TRANSFERENTE_PARAMS,
  ERROR_CANTIDAD,
  ERROR_ESTATUS_GENERAL,
};
