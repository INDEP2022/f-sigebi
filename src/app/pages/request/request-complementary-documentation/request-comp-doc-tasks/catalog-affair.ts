/**
 * @description
 * Catálogo de asuntos para la gestión de documentación complementaria
 * @interface
 */
export function getConfigAffair(requestId, affair, path, contributor = 'NA') {
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
            subtype: 'Registro_documentacion',
            ssubtype: 'TURNAR_SOLICITUD_DEVOLUCION',
          };
        case 33: //GESTIONAR BINES SIMILARES RESARCIMIENTO
          return {
            title: `BIENES SIMILARES Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-similar-goods',
            process: 'BSRegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_documentacion',
            ssubtype: 'TURNAR_RESARCIMIENTO_ESPECIE',
          };
        case 40: //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
          return {
            title: `RESOLUCIÓN ADMINISTRATIVA DE PAGO EN ESPECIE Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-compensation',
            process: 'RERegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_documentacion',
            ssubtype: 'TURNAR_RES_PAGO_ESPECIE',
          };
        case 41: //INFORMACIÓN DE BIENES: REGISTRO DE DOCUMENTACIÓN COMPLEMENTARIA
          return {
            title: `SOLICITUD DE INFORMACIÓN DEL DESTINO DEL BIEN Registro de Documentación Complementaria, No. Solicitud: ${requestId}`,
            url: 'pages/request/request-comp-doc/tasks/register-request-information-goods',
            process: 'IBRegistroSolicitudes',
            type: 'DOCUMENTACION_COMPLEMENTARIA',
            subtype: 'Registro_documentacion',
            ssubtype: 'TURNAR_SOL_INF_BIENES',
          };
      }
      break;

    //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
    case 'register-request-return':
      return {
        title: `DEVOLUCIÓN: Verificar Cumplimiento, No. Solicitud: ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/verify-compliance-return',
        process: 'DVerificarCumplimiento',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'verify-compliance-return':
      return {
        title: `Aprobar Devolución, No. Solicitud: ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/approve-return',
        process: 'DAprobarDevolucion',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'approve-return':
      break;

    //GESTIONAR BINES SIMILARES RESARCIMIENTO
    case 'register-request-similar-goods':
      return {
        title: `BIENES SIMILARES: Notificar a Transferente, No. Solicitud: ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/notify-transfer-similar-goods',
        process: 'BSNotificarTransferente',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'notify-transfer-similar-goods':
      return {
        title: `BIENES SIMILARES: Programar Visita Ocular, No. Solicitud:  ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/eye-visit-similar-goods',
        process: 'BSVisitaOcular',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'eye-visit-similar-goods':
      return {
        title: `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/validate-eye-visit-similar-goods',
        process: 'BSValidarVisitaOcular',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'validate-eye-visit-similar-goods':
      return {
        title: `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/validate-opinion-similar-goods',
        process: 'BSValidarResultadoVisitaOcular',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'validate-opinion-similar-goods':
      break;

    //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
    case 'register-request-compensation':
      return {
        title: `Revisión de Lineamientos Resarcimiento (EN ESPECIE), No. Solicitud ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/review-guidelines-compensation',
        process: 'RERevisionLineamientos',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'review-guidelines-compensation':
      return {
        title: `Generar Resultado de Análisis Resarcimiento (EN ESPECIE), No. Solicitud ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/analysis-result-compensation',
        process: 'REGenerarResultadoAnalisis',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'analysis-result-compensation':
      return {
        title: `Validar Dictamen Resarcimiento (EN ESPECIE), No. Solicitud ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/validate-opinion-compensation',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'validate-opinion-compensation':
      return {
        title: `, No. Solicitud ${requestId}, Contribuyente ${contributor}`,
        url: 'pages/request/request-comp-doc/tasks/notification-taxpayer-compensation',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'notification-taxpayer-compensation':
      break;

    /** CASOS INFORMACION DE BIENES */
    case 'register-request-compensation':
      return {
        title: `Generar Solicitud de Información y Oficio de Respuesta, No. Solicitud: ${requestId}`,
        url: 'pages/request/request-comp-doc/tasks/review-guidelines-compensation',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'review-guidelines-compensation':
      return {
        title: `Revisión del Oficio de Respuesta de Información, No. Solicitud: ${requestId}`,
        url: 'pages/request/request-comp-doc/tasks/analysis-result-compensation',
        process: '',
        type: 'DOCUMENTACION_COMPLEMENTARIA',
        subtype: 'Registro_documentacion',
        ssubtype: '',
      };
    case 'analysis-result-compensation':
      break;
  }

  return {
    title: '',
    url: '',
    process: '',
    ssubtype: '',
  };
}
