export const ADMINISTRATIVE_PROCESSES_ROUTES = [
  {
    label: 'Procesos Administrativos',
    icon: 'bx-folder',
    subItems: [
      /**
       * DAVID
       **/
      {
        label: 'Numerario Físico',
        link: '/pages/administrative-processes/numerary-physics',
      },
      {
        label: 'Otras Monedas',
        link: '/pages/administrative-processes/other-currencies',
      },
      {
        label: 'Valores por Expediente',
        link: '/pages/administrative-processes/values-per-file',
      },
      {
        label: 'Movimientos Cuentas General',
        link: '/pages/administrative-processes/general-account-movements',
      },
      {
        label: 'Bienes conversión',
        link: '/pages/administrative-processes/apply-lif',
      },
      {
        label: 'Actas Conversión',
        link: '/pages/administrative-processes/conversion-act',
      },
      {
        label: 'Solicitud de Avalúos',
        link: '/pages/administrative-processes/appraisal-request',
      },
      {
        label: 'Registro de Avalúos',
        link: '/pages/administrative-processes/appraisal-registry',
      },
      {
        label: 'Monitor de Avalúos',
        link: '/pages/administrative-processes/appraisal-monitor',
      },
      {
        label: 'Bienes sin Avalúos',
        link: '/pages/administrative-processes/appraisal-goods',
      },
      {
        label: 'Monitor de bienes incosteables',
        link: '/pages/administrative-processes/monitor-unavoidable-assets',
      },
      {
        label: 'Seguros y Vigilancia',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Mantenimiento de Pólizas',
            link: '/pages/administrative-processes/policy-maintenance',
          },
          {
            label: 'Pólizas de Seguro',
            link: '/pages/administrative-processes/insurance-policy',
          },
          {
            label: 'Altas de bienes en Pólizas',
            link: '/pages/administrative-processes/registration-of-policy',
          },
          {
            label: 'Baja de bienes en Pólizas',
            link: '/pages/administrative-processes/loss-of-policy',
          },
          {
            label: 'Mantenimiento',
            link: '/pages/administrative-processes/maintenance',
          },
          {
            label: 'Bitacora de Vigilancia',
            link: '/pages/administrative-processes/surveillance-log',
          },
          {
            label: 'Configuracion de correos de mantenimiento',
            link: '/pages/administrative-processes/maintenance-mail-configuration',
          },
          {
            label: 'Configuración de libreta de correos',
            link: '/pages/administrative-processes/email-book-config',
          },
          {
            label: 'Cotratos de Vigilancia',
            link: '/pages/administrative-processes/surveillance-contracts',
          },
          {
            label: 'Zonas de Vigilancia',
            link: '/pages/administrative-processes/surveillance-zones',
          },
        ],
      },
      /**
       * END DAVID
       **/
      /**
       * ALEXANDER
       **/
      {
        label: 'Regulaciones',
        link: '/pages/catalogs/regulatory',
      },
      {
        label: 'Respuestas Repuve',
        link: '/pages/catalogs/responseRepuve',
      },
      {
        label: 'Administración Conversión',
        link: '/pages/administrative-processes/conversion-management',
      },
      {
        label: 'Derivación Bienes',
        link: '/pages/administrative-processes/derivation-goods',
      },
      {
        label: 'Ubicación de Bienes',
        link: '/pages/administrative-processes/location-goods',
      },
      {
        label: 'Consulta de Almacenes',
        link: '/pages/administrative-processes/warehouse-inquiries',
      },
      {
        label: 'Consulta de Bóvedas',
        link: '/pages/administrative-processes/vault-consultation',
      },
      {
        label: 'Registro de mensaje del Bien',
        link: '/pages/administrative-processes/property-registration',
      },
      {
        label: 'Solicitud de cambio a numeración',
        link: '/pages/administrative-processes/request-numbering-change',
      },
      {
        label: 'Cambio de Estatus',
        link: '/pages/administrative-processes/change-of-status',
      },

      {
        label: 'Reclasificación masiva de bienes',
        link: '/pages/administrative-processes/massive-reclassification-goods',
      },
      /**
       * END ALEXANDER
       **/
      /**
       * FELIX
       **/
      {
        label: 'Venta de Bienes',
        link: '/pages/administrative-processes/sale-goods',
      },
      {
        label: 'Administracion Terceros',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Contratos',
            link: '/pages/administrative-processes/contracts',
          },
          {
            label: 'Costo unitario',
            link: '/pages/administrative-processes/unit-cost',
          },
          {
            label: 'Procesos para precios unitarios',
            link: '/pages/administrative-processes/process',
          },
          {
            label: 'Servicios para precios unitarios',
            link: '/pages/administrative-processes/services-unit-prices',
          },
          {
            label: 'Especificaciones para precios unitarios',
            link: '/pages/administrative-processes/specs',
          },
          {
            label: 'Turno y Tipo',
            link: '/pages/administrative-processes/turn-type',
          },
          {
            label: 'Unidades de medida',
            link: '/pages/administrative-processes/measurement-units',
          },
          {
            label: 'Variable costo',
            link: '/pages/administrative-processes/variable-cost',
          },
        ],
      },
      /**
       * END FELIX
       **/
      /**
       * LEGASPI
       **/
      {
        label: 'Atención Bienes',
        link: '/pages/administrative-processes/goods-tracking',
      },
      {
        label: 'Gestión Bienes Gab-Soc',
        link: '/pages/administrative-processes/goods-management',
      },
      {
        label: 'Empresas',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Resumen Info Financiera',
            link: '/pages/administrative-processes/summary-financial-info',
          },
        ],
      },
      {
        label: 'Reportes',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Almacenes',
            link: '/pages/administrative-processes/warehouse-reports',
          },
          {
            label: 'Expedientes',
            link: '/pages/administrative-processes/record-details',
          },
        ],
      },
      {
        label: 'Coversión de Paquetes',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Conversión Masiva',
            link: '/pages/administrative-processes/unit-conversion-packages',
          },
        ],
      },
      {
        label: 'Interacción SIAB-SAMI',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Relación de Bienes',
            link: '/pages/administrative-processes/siab-sami-interaction/',
          },
          {
            label: 'Pago de Bienes',
            link: '/pages/administrative-processes/siab-sami-interaction/payment-goods',
          },
          {
            label: 'Avalúo de Bienes',
            link: '/pages/administrative-processes/siab-sami-interaction/value-goods',
          },
        ],
      },
      {
        label: 'Servicios',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Monitor de Servicios',
            link: '/pages/administrative-processes/services/service-monitoring',
          },
          {
            label: 'Solicitud de Pago de Servicios',
            link: '/pages/administrative-processes/services/request-service-payments',
          },
          {
            label: 'Registro de Pago de Servicios',
            link: '/pages/administrative-processes/services/record-service-payments',
          },
        ],
      },
      /**
       * END LEGASPI
       **/
    ],
  },
];
