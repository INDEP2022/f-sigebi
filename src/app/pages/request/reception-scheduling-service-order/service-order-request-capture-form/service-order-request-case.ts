/**
 * @description
 * Catálogo de asuntos para la gestión de documentación complementaria
 * @interface
 */
export function getConfigService(path, data) {
  let progFolio = '';
  let folio = '';

  switch (path) {
    case 'service-order-request':
      return {
        title: `Solicitud orden de servicio (Captura de servicios)`,
        url: 'pages/request/reception-service-order/service-order-capture',
        process: 'ServiceOrderCapture',
        type: 'OrdenServicioRecepcion',
        subtype: 'PropuestaServicioINDEPEnviada',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-capture':
      return {
        title: `Solicitud Orden de Servicio (Validación de Servicios) con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-validation',
        process: 'ServiceOrderValidation',
        type: 'OrdenServicioRecepcion',
        subtype: 'OrdenServicioAutorizado',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-validation':
      return {
        title: `Aprobación de servicios (Programación de recepción: ${progFolio}) para la orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-aproval',
        process: 'ServiceOrderAproval',
        type: 'OrdenServicioRecepcion',
        subtype: 'OrdenFirmaPorDeleRegional',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-aproval':
      return {
        title: `Reporte de Implementación (Programación de recepción: ${progFolio}) para la orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report',
        process: 'ServiceOrderReport',
        type: 'OrdenServicioRecepcion',
        subtype: 'ReporteImplemenEnviadoINDEP',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report':
      return {
        title: `Validación de reporte de Implementación (Programación de recepción: ${progFolio}) Para el orden de servicio con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-validation',
        process: 'ServiceOrderReportValidation',
        type: 'OrdenServicioRecepcion',
        subtype: 'ReporteImplemenAutorizado',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-validation':
      return {
        title: `Validación de reporte de Implementación (Programación de recepción: ${progFolio}) Para el orden de servicio con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-signature',
        process: 'ServiceOrderReportSignature',
        type: 'OrdenServicioRecepcion',
        subtype: 'ReporteImplemenFirmadoDelegReg',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-signature':
      return {
        title: `Reporte de Implementación aprobado (Programación de recepción: ${progFolio}) Para el orden de servicio con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-aprove',
        process: 'ServiceOrderReportAprove',
        type: 'OrdenServicioRecepcion',
        subtype: 'AnexoWFirmaTercero',
        ssubtype: 'TURNAR',
        close: true,
      };
    //Caso para rechazo de orden de servicio
    case 'service-order-validation-reject':
      return {
        title: `Solicitud Orden de Servicio (Rechazo de Orden de Servicio) con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-validation-justification',
        process: 'ServiceOrderReportValidationJustification',
        type: 'OrdenServicioRecepcion',
        subtype: 'JustifiPropuestaServiEnviado',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-validation-justification':
      return {
        title: `Solicitud Orden de Servicio (Validación de Orden de Servicio) con el folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-reject',
        process: 'ServiceOrderReportReportReject',
        type: 'OrdenServicioRecepcion',
        subtype: 'PropuestaReporteImplemenNoAceptada',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-reject':
      return {
        title: `Rechazo de reporte de implementación (Programación de recepción: ${progFolio}) para el orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-justification-validation',
        process: 'ServiceOrderReportJustificationValidation',
        type: 'OrdenServicioRecepcion',
        subtype: 'JustificaPropuestaReporteImplemenEnviada',
        ssubtype: 'TURNAR',
        close: true,
      };

    case 'service-order-report-justification-validation':
      return {
        title: `Validación de reporte de implementación (Programación de recepción: ${progFolio}) para el orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-justification-reject',
        process: 'ServiceOrderReportJustificationReject',
        type: 'OrdenServicioRecepcion',
        subtype: 'JustificaPropuestaReporteImplemenRechazo',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-justification-reject':
      return {
        title: `Rechazo de orden de servicios (Programación de recepción: ${progFolio}) con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-reject',
        process: 'ServiceOrderReject',
        type: 'OrdenServicioRecepcion',
        subtype: 'ContrapropuestaServicioEnviado',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-reject':
      return {
        title: `Rechazo de reporte de implementación (Programación de recepción: ${progFolio}) para la orden de servicio con folio: ${folio}`,
        url: 'pages/request/reception-service-order/service-order-report-impl-reject',
        process: 'ServiceOrderReportReject',
        type: 'OrdenServicioRecepcion',
        subtype: 'ContrapropuestaReporteImpleEnviada',
        ssubtype: 'TURNAR',
        close: true,
      };
    case 'service-order-report-impl-reject':
      return {};
    default:
      return {};
  }
}
