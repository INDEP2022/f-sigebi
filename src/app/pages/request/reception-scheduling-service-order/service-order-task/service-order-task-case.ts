/**
 * @description
 * Catálogo de asuntos para la gestión de documentación complementaria
 * @interface
 */
export function getConfigService(path, data) {
  let progFolio = data.folio;
  let folio = data.folio;

  switch (path) {
    case 'service-order-request':
      return {
        title: `Solicitud orden de servicio (Captura de servicios)`,
        url: 'pages/request/reception-service-order/service-order-capture',
        process: 'ServiceOrderCapture',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
        rollBack: false,
      };
    case 'service-order-capture':
      return {
        title: `Solicitud Orden de Servicio (Validación de Servicios) con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-validation',
        process: 'ServiceOrderValidation',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-validation':
      return {
        title: `Aprobación de servicios (Programación de recepción: ${progFolio}) para la orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-aproval',
        process: 'ServiceOrderAproval',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-aproval':
      return {
        title: `Reporte de Implementación (Programación de recepción: ${progFolio}) para la orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report',
        process: 'ServiceOrderReport',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report':
      return {
        title: `Validación de reporte de Implementación (Programación de recepción: ${progFolio}) Para el orden de servicio con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-validation',
        process: 'ServiceOrderReportValidation',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };

    //Orden de servicio reporte de implementación

    case 'service-order-report-validation':
      return {
        title: `Validación de reporte de Implementación (Programación de recepción: ${progFolio}) Para el orden de servicio con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-signature',
        process: 'ServiceOrderReportSignature',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-signature':
      return {
        title: `Reporte de Implementación aprobado (Programación de recepción: ${progFolio}) Para el orden de servicio con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-aprove',
        process: 'ServiceOrderReportAprove',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    //Caso para rechazo de orden de servicio
    case 'service-order-validation-reject':
      return {
        title: `Solicitud Orden de Servicio (Rechazo de Orden de Servicio) con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-validation-justification',
        process: 'ServiceOrderReportValidationJustification',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-validation-justification':
      return {
        title: `Solicitud Orden de Servicio (Validación de Orden de Servicio) con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-reject',
        process: 'ServiceOrderReportReportReject',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };

    case 'service-order-report-reject':
      return {
        title: `Solicitud Orden de Servicio (Validación de Reporte) con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-justification-validation',
        process: 'ServiceOrderReportJustificationValidation',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-justification-validation':
      return {
        title: `Rechazo de reporte de implementación (Programación de recepción: ${progFolio}) para el orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-justification-reject',
        process: 'ServiceOrderReportJustificationValidation',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };

    case 'service-order-report-justification-reject':
      return {
        title: `Validación de reporte de implementación (Programación de recepción: ${progFolio}) para el orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-validation-justification',
        process: 'ServiceOrderReportJustificationReject',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-validation-justification':
      return {
        title: `Rechazo de orden de servicios (Programación de recepción: ${progFolio}) con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-reject',
        process: 'ServiceOrderReject',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-reject':
      return {
        title: `Rechazo de reporte de implementación (Programación de recepción: ${progFolio}) para la orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-impl-reject',
        process: 'ServiceOrderReportReject',
        type: 'SOLICITUD_PROGRAMACION',
        subtype: 'Programar_Recepcion',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-impl-reject':
      return {};
    default:
      return {};
  }
}
