export const GENERAL_PROCESSES_ROUTES = [
  {
    label: 'Procesos Generales',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Asociación de Notificaciones',
        link: '/pages/general-processes/notifications-association',
      },
      {
        label: 'Características del Bien',
        link: '/pages/general-processes/goods-characteristics',
      },
      {
        label: 'Historico Situación del Bien',
        link: '/pages/general-processes/historical-good-situation',
      },
      {
        label: 'Depuración de Expedientes',
        link: '/pages/general-processes/purging-records',
      },
      {
        label: 'Rastreador de Bienes',
        link: '/pages/general-processes/goods-tracker',
      },
      {
        label: 'Rastreador de Expedientes',
        link: '/pages/general-processes/records-tracker',
      },
      {
        label: 'Solicitud de Digitalización',
        link: '/pages/general-processes/scan-request',
      },
      {
        label: 'Escaneo y Digitalización',
        link: '/pages/general-processes/scan-request/scan',
      },
      {
        label: 'Visualizar Documentos',
        link: '/pages/general-processes/documents-viewer',
      },
      {
        label: 'Indicadores',
        subItems: [
          {
            label: 'Captura y Digitalización',
            link: '/pages/general-processes/indicators/capture-and-digitalization',
          },
          {
            label: 'Dictaminación',
            link: '/pages/general-processes/indicators/opinion',
          },
          {
            label: 'Recepción y Entrega',
            link: '/pages/general-processes/indicators/reception-and-delivery',
          },
          {
            label: 'Fichas Técnicas',
            link: '/pages/general-processes/indicators/technical-datasheet',
          },
          {
            label: 'Estados de Cuenta',
            link: '/pages/general-processes/indicators/account-status',
          },
        ],
      },
    ],
  },
];
