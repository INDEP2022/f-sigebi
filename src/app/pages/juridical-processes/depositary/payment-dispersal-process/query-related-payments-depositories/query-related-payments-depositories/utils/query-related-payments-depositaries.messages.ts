const ERROR_GOOD_PARAM = `El No. Bien ingresado como parámetro no es un número`;
const ERROR_GOOD_NULL = `Ingresa un No. Bien`;
const NOT_FOUND_GOOD_APPOINTMENT = (error: string) =>
  `El No. Bien no existe. ${error}`;
const NOT_FOUND_GOOD = (error: string) =>
  `Error al cargar la información del bien. ${error}`;
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

export {
  ERROR_GOOD_PARAM,
  ERROR_GOOD_NULL,
  NOT_FOUND_GOOD_APPOINTMENT,
  NOT_FOUND_GOOD,
  NOT_FOUND_GOOD_DESCRIPTION,
  NOT_FOUND_PAYMENTS_BANK,
  NOT_FOUND_PAYMENTS_BANK_TOTALS,
  NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS,
  NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS_TOTALS,
};
