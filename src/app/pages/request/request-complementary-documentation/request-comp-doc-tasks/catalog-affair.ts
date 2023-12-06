/**
 * @description
 * Catálogo de asuntos para la gestión de documentación complementaria
 * @interface
 */
export function getConfigAffair(requestId, affair, path, request: any = {}) {
  let contributor =
    'Contribuyente: ' +
    request.indicatedTaxpayer +
    ', PAMA: ' +
    request.transferenceFile;

  affair = parseInt(affair);

  switch (path) {

    //Se crea solicitud decumentación complementaria
    case 'create':
      switch (affair) {
        case 10: //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
          return {
            title: `DEVOLUCIÓN: Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-return',
            process: 'DRegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_Solicitud',
            ssubtype: 'TURNAR',
            close: true,
          };
        case 33: //GESTIONAR BINES SIMILARES RESARCIMIENTO
          return {
            title: `BIENES SIMILARES Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-similar-goods',
            process: 'BSRegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_Solicitud',
            ssubtype: 'TURNAR',
            close: true,
          };
        case 40: //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
          return {
            title: `RESARCIMIENTO EN ESPECIE: Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-compensation',
            process: 'RERegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_Solicitud',
            ssubtype: 'TURNAR',
            close: true,
          };
        case 41: //INFORMACIÓN DE BIENES: REGISTRO DE DOCUMENTACIÓN COMPLEMENTARIA
          return {
            title: `SOLICITUD DE INFORMACIÓN DEL DESTINO DEL BIEN Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-information-goods',
            process: 'IBRegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_Solicitud',
            ssubtype: 'TURNAR',
            close: true,
          };
      }
      break;

    //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
    case 'register-request-return':
      return {
        title: `DEVOLUCIÓN: Verificar Cumplimiento, No. Solicitud: ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/verify-compliance-return',
        process: 'DVerificarCumplimiento',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'verify-compliance-return':
      return {
        title: `Aprobar Devolución, No. Solicitud: ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/approve-return',
        process: 'DAprobarDevolucion',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'approve-return':
      break;

    //GESTIONAR BINES SIMILARES RESARCIMIENTO
    case 'register-request-similar-goods':
      return {
        title: `BIENES SIMILARES: Notificar a Transferente, No. Solicitud: ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/notify-transfer-similar-goods',
        process: 'BSNotificarTransferente',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'notify-transfer-similar-goods':
      return {
        title: `BIENES SIMILARES: Programar Visita Ocular, No. Solicitud:  ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/eye-visit-similar-goods',
        process: 'BSVisitaOcular',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'eye-visit-similar-goods':
      return {
        title: `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/validate-eye-visit-similar-goods',
        process: 'BSValidarVisitaOcular',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'validate-eye-visit-similar-goods':
      return {
        title: `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/validate-opinion-similar-goods',
        process: 'BSValidarResultadoVisitaOcular',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'validate-opinion-similar-goods':
      return {
        title: `BIENES SIMILARES: Elaborar Oficio de Respuesta, No. Solicitud: ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/response-letter-similar-goods',
        process: 'BSElaborarOficioRespuesta',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'response-letter-similar-goods':
      break;

    //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
    case 'register-request-compensation':
      return {
        title: `Revisión de Lineamientos Resarcimiento (EN ESPECIE), No. Solicitud ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/review-guidelines-compensation',
        process: 'RERevisionLineamientos',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'review-guidelines-compensation':
      return {
        title: `Generar Resultado de Análisis Resarcimiento (EN ESPECIE), No. Solicitud ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/analysis-result-compensation',
        process: 'REGenerarResultadoAnalisis',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'analysis-result-compensation':
      return {
        title: `Validar Dictamen Resarcimiento (EN ESPECIE), No. Solicitud ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/validate-opinion-compensation',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'validate-opinion-compensation':
      return {
        title: `, No. Solicitud ${requestId} ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/notification-taxpayer-compensation',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'notification-taxpayer-compensation':
      break;

    /** CASOS INFORMACION DE BIENES */
    case 'register-request-information-goods':
      return {
        title: `Generar Solicitud de Información y Oficio de Respuesta, No. Solicitud: ${requestId}`,
        url: 'pages/request/request-comp-doc/tasks/respose-office-information-goods',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'respose-office-information-goods':
      return {
        title: `Revisión del Oficio de Respuesta de Información, No. Solicitud: ${requestId}`,
        url: 'pages/request/request-comp-doc/tasks/review-office-information-goods',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_Solicitud',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'review-office-information-goods':
      break;
  }

  return {
    title: '',
    url: '',
    process: '',
    ssubtype: '',
    close: true,
  };

  return {
    title: '',
    url: '',
    process: '',
    ssubtype: '',
    close: true,
  };
}
