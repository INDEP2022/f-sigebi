interface Data {
  DI_MONEDA_NEW: string;
  DISPONIBLE: string;
  NO_BIEN: string;
  TIPO_CONV: string;
  PRECIO_VENTA: string;
}

declare const HttpStatus: any;

export function functionForBack(data: Data[]) {
  // const dataExcel = getData(file);

  data.forEach(element => {
    const goodId = element.NO_BIEN;
    const isValidNumerary = PUP_VALIDANUME(goodId);
    if (element.DISPONIBLE) {
      if (element.DI_MONEDA_NEW && isValidNumerary) {
        return errorBack('Debe especificar el tipo de moneda.');
      }
      if (
        (isValidNumerary && ['CNE', 'BBB'].includes(element.TIPO_CONV)) ||
        (!isValidNumerary && element.TIPO_CONV === 'CNE')
      ) {
        return errorBack(
          'El tipo de conversión seleccionado no es permitido para este bien: ' +
            goodId
        );
      }

      if (!element.PRECIO_VENTA) {
      }
    }
  });
}

function errorBack(message: string): any {
  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message,
    data: null,
  };
}

function PUP_VALIDANUME(goodNumber: string) {
  return true;
}
