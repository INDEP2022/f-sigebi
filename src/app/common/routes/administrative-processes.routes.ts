export const ADMINISTRATIVE_PROCESSES_ROUTES = [
  {
    label: 'Procesos Administrativos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Administracion Bienes',
        link: '/pages/administrative-processes/administration-assets',
      },
      /**
       * DAVID
       **/
      {
        label: 'Numerario Físico',
        link: '/pages/administrative-processes/numerary-physics',
      },
      {
        label: 'Numerario Operado',
        link: '/pages/administrative-processes/numerary-operator',
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
        label: 'Devoluciones y decomisos',
        link: '/pages/administrative-processes/returns-confiscation',
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
            label: 'Reportes de Pólizas',
            link: '/pages/administrative-processes/policies-report',
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
            label: 'Solicitudes',
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
          {
            label: 'Conceptos de Vigilancia',
            link: '/pages/administrative-processes/surveillance-concepts',
          },
          {
            label: 'Calculo de Vigilancia',
            link: '/pages/administrative-processes/surveillance-calculate',
          },
          {
            label: 'Prorrateo de bienes de vigilancia comúm',
            link: '/pages/administrative-processes/prorrateo-goods-surveillance',
          },
          {
            label: 'Reportes de vigilancia',
            link: '/pages/administrative-processes/surveillance-reports',
          },
          {
            label: 'Baja de bienes en polizas',
            link: '/pages/administrative-processes/deregistration-of-goods',
          },
          {
            label: 'Visitas a inmuebles',
            link: '/pages/administrative-processes/expenses-format',
          },
        ],
      },
      {
        label: 'Gastos y Costos',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Catalogo de conceptos de gasto',
            link: '/pages/administrative-processes/catalogue-concepts',
          },
          {
            label: 'Tipos de Cambio',
            link: '/pages/administrative-processes/exchange-types',
          },
          {
            label: 'Procedimiento de cierres de costos',
            link: '/pages/administrative-processes/costs-procedures',
          },
          {
            label: 'Gastos aplicados a bienes',
            link: '/pages/administrative-processes/costs-applied-goods',
          },
          {
            label: 'Resumen de Gastos',
            link: '/pages/administrative-processes/costs-resume',
          },
          {
            label: 'Gastos centralizados',
            link: '/pages/administrative-processes/centralized-expenses',
          },
          {
            label: 'Registro de Gastos',
            link: '/pages/administrative-processes/expenses-register',
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
      {
        label: 'Cambio masivo de estatus',
        link: '/pages/administrative-processes/massive-change-status',
      },
      {
        label: 'Cambio de estatus',
        link: '/pages/administrative-processes/change-of-status',
      },
      {
        label: 'Cambio de estatus STI',
        link: '/pages/administrative-processes/change-status-sti',
      },
      {
        label: 'Proceso de reclamación de pago',
        link: '/pages/administrative-processes/payment-claim-process',
      },
      {
        label: 'Regularización jurídica',
        link: '/pages/administrative-processes/legal-regularization',
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
        label: 'Firma Electrónica',
        link: '/pages/administrative-processes/electronic-signature',
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
          {
            label: 'Coordinacion por zonas',
            link: '/pages/administrative-processes/zones',
          },
        ],
      },
      {
        label: 'Cuenta de numerario asegurado',
        link: '/pages/administrative-processes/insured-numerary-account',
      },
      {
        label: 'Empresas',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Reporte de evaluación de desempeño',
            link: '/pages/administrative-processes/performance-evaluation-report',
          },
        ],
      },
      {
        label: 'Conversión de bienes',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Actas conversión',
            link: '/pages/administrative-processes/proceedings-conversion',
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
            link: '/pages/administrative-processes/siab-sami-interaction/goods-relationship',
          },
          {
            label: 'Pago de Bienes',
            link: '/pages/administrative-processes/siab-sami-interaction/payment-goods',
          },
          {
            label: 'Avalúo de Bienes',
            link: '/pages/administrative-processes/siab-sami-interaction/value-goods',
          },
          /*label: 'Resarcimientos/Devoluciones',
            icon: 'bx-folder',
            subItems: [],*/
          {
            label: 'Bienes Relacionados',
            link: '/pages/administrative-processes/siab-sami-interaction/refunds/goods-relationship',
          },
          {
            label: 'Solicitud de Pago',
            link: '/pages/administrative-processes/siab-sami-interaction/refunds/payment-request',
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
