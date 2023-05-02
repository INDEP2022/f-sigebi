export const FINAL_DESTINATION_PROCESS_ROUTES = [
  {
    label: 'Proceso Destino final',
    icon: 'bx-share-alt',
    subItems: [
      {
        label: 'Actas de Destino',
        link: '/pages/final-destination-process/destination-acts',
      },
      {
        label: 'Actas de Destrucción',
        link: '/pages/final-destination-process/destruction-acts',
      },
      {
        label: 'Actas de Devolución',
        link: '/pages/final-destination-process/return-acts',
      },
      {
        label: 'Actas de Donación',
        link: '/pages/final-destination-process/donation-acts',
      },
      {
        label: 'Actas de Posesión de Terceros',
        link: '/pages/final-destination-process/third-possession-acts',
      },
      {
        label: 'Reporte de Actas Donación/Destrucción/Destino',
        subItems: [
          {
            label: 'Actas de Donación/Destrucción/Destino',
            link: '/pages/final-destination-process/report-of-acts/donation-destruction-destination',
          },
        ],
      },
      {
        label: 'Programación de Entregas',
        subItems: [
          {
            label: 'Programación de Eventos',
            link: '/pages/final-destination-process/delivery-schedule/schedule-of-events',
          },
        ],
      },
      //Proceso de Donación
      {
        label: 'Proceso de Donación',
        subItems: [
          {
            label: 'Exportación de Bienes para Donación',
            link: '/pages/final-destination-process/donation-process/export-goods-donation',
          },
          {
            label: 'Propuesta de Inventarios para Donación Web',
            link: '/pages/final-destination-process/donation-process/web-donation-inventories',
          },
          {
            label: 'Propuesta de Inventarios para Donación Directa',
            link: '/pages/final-destination-process/donation-process/direct-donation-inventories',
          },
          {
            label: 'Mantenimiento Comprometer para Donación',
            link: '/pages/final-destination-process/donation-process/maintenance-commitment-donation',
          },
          {
            label: 'Aprobación para Donación',
            link: '/pages/final-destination-process/donation-process/approval-for-donation',
          },
          {
            label: 'Solicitud y Autorización de Donación',
            link: '/pages/final-destination-process/donation-process/donation-authorization-request',
          },
          {
            label: 'Registro para Inventarios y Donación Directa',
            link: '/pages/final-destination-process/donation-process/registration-inventories-donation',
          },
          {
            label: 'Contratos de Donación',
            link: '/pages/final-destination-process/donation-process/donation-contracts',
          },
          {
            label: 'Contratos de Donación Directa Administrador',
            link: '/pages/final-destination-process/donation-process/administrator-donation-contract',
          },
          //VISTAS A LAS QUE SE LES DEBE VERIFICAR SU RUTA
          {
            label: 'Parcialización Bienes en Donación',
            link: '/pages/final-destination-process/donation-process/partialization-goods-donation',
          },
          {
            label: 'Procesos de Donación',
            link: '/pages/final-destination-process/donation-process/donation-processes',
          },
        ],
      },
      {
        label: 'Actas Circunstanciadas de Suspensión/Cancelación',
        link: '/pages/final-destination-process/circumstantial-acts-suspension-cancellation',
      },
      {
        label: 'Actas Circunstanciadas de Cancelación de Ent por Robo',
        link: '/pages/final-destination-process/acts-circumstantiated-cancellation-theft',
      },
      {
        label: 'Constancias de Entrega',
        link: '/pages/final-destination-process/proof-of-delivery',
      },
      {
        label: 'Actas de Bienes Entregados para Estudio',
        link: '/pages/final-destination-process/acts-goods-delivered',
      },
      {
        label: 'Actas de Regularización por Inexistencia Física',
        link: '/pages/final-destination-process/acts-regularization-non-existence',
      },
      {
        label: 'Reporte de Actas de Devolución',
        link: '/pages/final-destination-process/return-acts-report',
      },
      {
        label: 'Fichas Técnicas',
        link: '/pages/final-destination-process/technical-sheets',
      },
      {
        label: 'Revisión de Fichas Técnicas',
        link: '/pages/final-destination-process/review-technical-sheets',
      },
      //VISTAS A LAS QUE SE LES DEBE VERIFICAR SU RUTA O SI SON LLAMADAS DESDE OTRA VISTA
      {
        label: 'Comprobación de Requisitos Documentales por Donación',
        link: '/pages/final-destination-process/check-donation-requirements',
      },
      {
        label: 'Comprobación de Requisitos Documentales por Destrucción',
        link: '/pages/final-destination-process/check-destruction-requirements',
      },
      {
        label: 'Comprobación de Requisitos Documentales para Destino',
        link: '/pages/final-destination-process/check-destination-requirements',
      },
    ],
  },
];
