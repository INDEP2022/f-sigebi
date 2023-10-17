const ERROR_GOOD_PARAM = `El No. Bien ingresado como parámetro no es un número`;
const ERROR_GOOD_NULL = `Ingresa un No. Bien válido`;
const ERROR_APOINTMENT_NUMBER_NULL = `Se requiere un número de nombramiento, realiza la búsqueda por No. Bien para cargar los datos del nombramiento`;
const ERROR_DATE_DISPERSAL_NULL = `Se requiere una fecha para realizar la eliminación de la dispersión`;
const NOT_FOUND_GOOD_APPOINTMENT = (error: string) =>
  `El No. Bien no existe. ${error}`;
const NOT_FOUND_PERSONS_DEPOSITARY = (error: string) =>
  `Error al cargar la información de nombramientos por depositarías. ${error}`;
const NOT_FOUND_GOOD_DESCRIPTION = (error: string) =>
  `Error al consultar la descripción del bien. ${error}`;
const NOT_FOUND_PAYMENTS_BANK = (error: string) =>
  `Error al consultar los pagos recibidos en el banco. ${error}`;
const NOT_FOUND_PAYMENTS_BANK_TOTALS = (error: string) =>
  `Error al consultar la suma total de los depósitos. ${error}`;
const NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS = (error: string) =>
  `Error al consultar la composición de pagos recibidos. ${error}`;
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
  `Error al validar la depositaría para el número de nombramientro ${no_nombramiento}. ${error}`;
const NOT_FOUND_GET_VALID_STATUS = (error: string, no_nombramiento: number) =>
  `Error al validar los estatus de los bienes para el número de nombramientro ${no_nombramiento}. ${error}`;
const NOT_FOUND_GET_VALID_BLACKLIST = (
  error: string,
  no_nombramiento: number
) =>
  `Error al validar si el depositario se encuentra en lista negra para el número de nombramientro ${no_nombramiento}. ${error}`;
const NOT_FOUND_REMOVE_PAYMENTS = (
  error: string,
  no_nombramiento: number,
  date_param: string
) =>
  `Error al remover la depositaría para el número de nombramiento: ${no_nombramiento} y la fecha: ${date_param}. ${error}`;
const CORRECT_REMOVE_PAYMENTS = (no_nombramiento: number, date_param: string) =>
  `Se realizó correctamente la eliminación de la dispersión de pagos para el número de nombramiento: ${no_nombramiento} y la fecha: ${date_param}`;

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
  NOT_FOUND_REMOVE_PAYMENTS,
  CORRECT_REMOVE_PAYMENTS,
};
