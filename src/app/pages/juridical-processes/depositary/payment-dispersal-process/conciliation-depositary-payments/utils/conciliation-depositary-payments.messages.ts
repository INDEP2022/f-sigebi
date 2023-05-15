const ERROR_GOOD_PARAM = `El número de Bien ingresado como parámetro no es un número`;
const ERROR_GOOD_NULL = `Ingresa un número de Bien`;
const ERROR_APOINTMENT_NUMBER_NULL = `Se requiere un número de nombramiento, realiza la búsqueda por número de bien para cargar los datos del Nombramiento`;
const ERROR_DATE_DISPERSAL_NULL = `Se requiere una Fecha para realizar la Eliminación de la Dispersión`;
const NOT_FOUND_GOOD_APPOINTMENT = (error: string) =>
  `El número de Bien no existe. ${error}`;
const NOT_FOUND_PERSONS_DEPOSITARY = (error: string) =>
  `Error al Cargar la Información de Nombramientos por Depositarías. ${error}`;
const NOT_FOUND_GOOD_DESCRIPTION = (error: string) =>
  `Error al consultar la descripción del Bien. ${error}`;
const NOT_FOUND_PAYMENTS_BANK = (error: string) =>
  `Error al consultar los Pagos Recibidos en el Banco. ${error}`;
const NOT_FOUND_PAYMENTS_BANK_TOTALS = (error: string) =>
  `Error al consultar la suma Total de los Depósitos. ${error}`;
const NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS = (error: string) =>
  `Error al consultar la Composición de Pagos Recibidos. ${error}`;
const NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS_TOTALS = (error: string) =>
  `Error al consultar la suma de los totales. ${error}`;
const NOT_FOUND_GET_PARAMSDEP_PAYMENTS = (
  error: string,
  no_nombramiento: number
) =>
  `Error al validar los parámetros para el número de nombramientro ${no_nombramiento}. ${error}`;
const NOT_FOUND_GET_VALIDADEP_PAYMENTS = (
  error: string,
  no_nombramiento: number
) =>
  `Error al validar la Depositaría para el número de nombramientro ${no_nombramiento}. ${error}`;
const NOT_FOUND_GET_VALID_STATUS = (error: string, no_nombramiento: number) =>
  `Error al validar los estatus de los bienes para el número de nombramientro ${no_nombramiento}. ${error}`;
const NOT_FOUND_GET_VALID_BLACKLIST = (
  error: string,
  no_nombramiento: number
) =>
  `Error al validar si el Depositario se encuentra en Lista Negra para el número de nombramientro ${no_nombramiento}. ${error}`;

export {
  ERROR_GOOD_PARAM,
  ERROR_GOOD_NULL,
  ERROR_DATE_DISPERSAL_NULL,
  NOT_FOUND_GOOD_APPOINTMENT,
  NOT_FOUND_PERSONS_DEPOSITARY,
  NOT_FOUND_GOOD_DESCRIPTION,
  NOT_FOUND_PAYMENTS_BANK,
  NOT_FOUND_PAYMENTS_BANK_TOTALS,
  NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS,
  NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS_TOTALS,
  NOT_FOUND_GET_PARAMSDEP_PAYMENTS,
  NOT_FOUND_GET_VALID_STATUS,
  NOT_FOUND_GET_VALID_BLACKLIST,
  ERROR_APOINTMENT_NUMBER_NULL,
  NOT_FOUND_GET_VALIDADEP_PAYMENTS,
};
