export const DOCUMENTS_RECEPTION_ROUTES = [
  {
    label: 'Recepción documental',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Registro de volantes',
        link: '/pages/documents-reception/flyers-registration',
      },
      {
        label: 'Captura de bienes',
        link: '/pages/documents-reception/goods-capture',
      },
      {
        label: 'Envio de oficios',
        link: '/pages/documents-reception/shipping-documents',
      },
      {
        label: 'Impresion de Volantes',
        link: '/pages/documents-reception/print-flyers',
      },
      {
        label: 'Reporte de recepcion documental',
        link: '/pages/documents-reception/report',
      },
      {
        label: 'Resumen de recepcion documental',
        link: '/pages/documents-reception/summary',
      },
      {
        label: 'Archivo plano de notificaciones',
        link: '/pages/documents-reception/notifications-flat-file',
      },
      {
        label: 'Carga masiva de bienes',
        link: '/pages/documents-reception/goods-bulk-load',
      },
      // { ### NO SE MIGRA ###
      //   label: 'Carga de bienes SAT-SAE',
      //   link: '/pages/documents-reception/sat-sae-goods-load',
      // },
      {
        label: 'Buzón de asuntos SAT',
        link: '/pages/documents-reception/sat-subjects-register',
      },
      {
        label: 'Buzón de asuntos FGR',
        link: '/pages/documents-reception/subjects-register',
      },
      /*##NO SE MIGRA##*/
      /*{
        label: 'Comprobación de Requisitos Documentales',
        link: '/pages/documents-reception/documents-requirements-verification',
      },*/
      {
        label: 'Cierre de Actas de Decomiso y Devolución',
        link: '/pages/documents-reception/closing-of-confiscation-and-return-records',
      },
      /*##NO SE MIGRA##*/
      /*{
        label: 'Inventario por Expediente',
        link: '/pages/documents-reception/records-inventory',
      },*/
      {
        label: 'Previsión de Bienes',
        link: '/pages/documents-reception/goods-forecast',
      },
      // { ### Esta pantalla se llama desde Cierre de Actas de Decomiso y Devolución
      //   label: 'Validadores de Actas',
      //   link: '/pages/documents-reception/records-validation',
      // },
      {
        label: 'Servicio de vigilancia para Bienes',
        link: '/pages/documents-reception/goods-vigilance-service',
      },
    ],
  },
];
