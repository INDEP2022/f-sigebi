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
            label: 'Acceso a Usuarios',
            link: '/pages/administrative-processes/user-access',
          },
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
          {
            label: 'Reportes de Incorporación de Bienes a Pólizas',
            link: '/pages/administrative-processes/goods-to-policies-reports',
          },
          {
            label: 'Porcentajes de Supervisión y vigilancia',
            link: '/pages/administrative-processes/percentage-surveillance',
          },
          {
            label: 'Movimiento de Bienes en vigilancia',
            link: '/pages/administrative-processes/movements-goods-surveillance',
          },
          {
            label: 'Servicio de Vigilancia',
            link: '/pages/administrative-processes/surveillance-service',
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
          {
            label: 'Conceptos de Gastos',
            link: '/pages/administrative-processes/expenses-concepts',
          },
          {
            label: 'Criterios de aplicación',
            link: '/pages/administrative-processes/applicants-criteria',
          },
          {
            label: 'Clasificación costos',
            link: '/pages/administrative-processes/costs-clasification',
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
        label: 'Cambio de indicadores de destino de bienes',
        link: '/pages/administrative-processes/change-destination-goods-indicators',
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
        label: 'Cambio de status',
        link: '/pages/administrative-processes/change-of-status',
      },
      {
        label: 'Cambio de status STI',
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
      {
        label: 'Cambio de Clasificación del Bien',
        link: '/pages/administrative-processes/change-of-good-classification',
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
          /*{
            label: 'Almacenes',
            icon: 'bx-folder',
            subItems: [],
          },*/
          {
            label: 'Alta de Almacenes por Contrato',
            link: '/pages/administrative-processes/reg-warehouse-contract',
          },
          {
            label: 'Bienes en almacén',
            link: '/pages/administrative-processes/warehouses',
          },
          {
            label: 'Reportes de Almacén',
            link: '/pages/administrative-processes/storehouse',
          },
          {
            label: 'Tipo de Almacén',
            link: '/pages/administrative-processes/warehouse-type',
          },

          {
            label: 'Control de las ordenes de servicio',
            link: '/pages/administrative-processes/control-service-orders',
          },
          {
            label: 'Ordenes de servicio',
            link: '/pages/administrative-processes/service-orders-format',
          },
          {
            label: 'Reporte de implementacion',
            link: '/pages/administrative-processes/implementation-report',
          },
          {
            label: 'Indicador de Desempeño',
            link: '/pages/administrative-processes/performance-indicator',
          },
          {
            label: 'Reportes de la O.DE S.',
            link: '/pages/administrative-processes/service-order-reports',
          },
        ],
      },
      {
        label: 'Cuenta de numerario asegurado',
        link: '/pages/administrative-processes/insured-numerary-account',
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
          {
            label: 'Reporte de evaluación de desempeño',
            link: '/pages/administrative-processes/performance-evaluation-report',
          },
          {
            label: 'Reporte de inventario',
            link: '/pages/administrative-processes/inventory-report',
          },
          {
            label: 'Indicadores por Bien',
            link: '/pages/administrative-processes/indicators-per-good',
          },
          {
            label: 'Reporte de información financiera',
            link: '/pages/administrative-processes/financial-information-report',
          },
          {
            label: 'Información financiera',
            link: '/pages/administrative-processes/financial-information',
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
          {
            label: 'Bienes por Tipo de Delito',
            link: '/pages/administrative-processes/goods-type-crime-reports',
          },
          {
            label: 'Histórico de situación procesal de los bienes',
            link: '/pages/administrative-processes/procedural-history',
          },
          {
            label: 'Generación de informacion para reporte COORD',
            link: '/pages/administrative-processes/information-generation',
          },
          {
            label: 'Bóvedas y Gavetas',
            link: '/pages/administrative-processes/vaults',
          },
          {
            label: 'Concentrado de bienes por expendiente',
            link: '/pages/administrative-processes/concentrate-goods-type',
          },
          {
            label: 'Generación de archivo plano',
            link: '/pages/administrative-processes/flat-file-for-good',
          },
          {
            label: 'Devoluciones y Decomisios de Bienes',
            link: '/pages/administrative-processes/return-confiscation-property',
          },
          {
            label: 'Archivo plano de avaluos por Bien',
            link: '/pages/administrative-processes/generate-excel-file',
          },
          {
            label: 'Gastos por bien',
            link: '/pages/administrative-processes/bills-good',
          },
          {
            label: 'Analitico de bienes inmuebles',
            link: '/pages/administrative-processes/real-estate-analytical-report',
          },
          {
            label: 'Acumulado de bienes mensual',
            link: '/pages/administrative-processes/accumulated-monthly-assets',
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
          {
            label: 'Concentrado de bienes para contabilidad',
            link: '/pages/administrative-processes/services/descripcion-of-the-matter',
          },
          {
            label: 'Factura de reportes de implementación',
            link: '/pages/administrative-processes/services/implementation-reports-invoices',
          },
        ],
      },
      {
        label: 'Devoluciones y Decomisos',
        link: '/pages/administrative-processes/returns-confiscations',
      },
      /**
       * END LEGASPI
       **/
      /**START Abner */
      {
        label: 'Numerario',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Registro de fichas de deposito',
            link: '/pages/administrative-processes/numerary/deposit-tokens',
          },
          {
            label: 'Calculo de numerario',
            link: '/pages/administrative-processes/numerary/numerary-calc',
          },
          {
            label: 'Solicitud de numerario',
            link: '/pages/administrative-processes/numerary/numerary-request',
          },
          {
            label: 'Conciliación masiva numerario',
            link: '/pages/administrative-processes/numerary-massive-consiliation',
          },
          {
            label: 'Transferencia de cuentas a oficinas centrales',
            link: '/pages/administrative-processes/central-offices-transference',
          },
          {
            label: 'Transferencia de cuentas a Regional',
            link: '/pages/administrative-processes/regional-accounts-transference',
          },
          {
            label: 'Movimientos tesofe',
            link: '/pages/administrative-processes/tesofe-movements',
          },
          {
            label: 'Conciliación de fichas de deposito vs expediente',
            link: '/pages/administrative-processes/deposit-tokens-conciliation',
          },
          {
            label: 'Devolución de numerario efectivo',
            link: '/pages/administrative-processes/effective-numerary-devolution',
          },
          {
            label: 'Cuentas aseguradas por expediente',
            link: '/pages/administrative-processes/accounts-insured-by-file',
          },
          {
            label: 'Conciliación de numerario efectivo',
            link: '/pages/administrative-processes/effective-numerary-reconciliation',
          },
          {
            label: 'Cuentas aseguradas por bancos',
            link: '/pages/administrative-processes/bank-accounts-insured',
          },
          {
            label: 'Estado de cuenta por Indiciado',
            link: '/pages/administrative-processes/massive-account-indiciado',
          },
          {
            label: 'Expedientes sin conciliar',
            link: '/pages/administrative-processes/unreconcilied-files',
          },
          {
            label: 'Fichas de deposito sin conciliar',
            link: '/pages/administrative-processes/deposit-unreconcilied-files',
          },
          {
            label: 'Relación de decomiso',
            link: '/pages/administrative-processes/confiscation-ratio',
          },
          {
            label: 'Registro de Estados de cuenta',
            link: '/pages/administrative-processes/record-account-statements',
          },
          {
            label: 'Estado de cuenta (Deposito)',
            link: '/pages/administrative-processes/deposit-account-statement',
          },
          {
            label: 'Tasas para interes',
            link: '/pages/administrative-processes/rate-catalog',
          },
          {
            label: 'Cambio a numerario',
            link: '/pages/commercialization/numeraire-exchange',
          },
          {
            label: 'Cambio a numerario masivo',
            link: '/pages/administrative-processes/massive-numerary-change',
          },
          {
            label: 'Cierre historico de numerario',
            link: '/pages/administrative-processes/numerary-historical-closing',
          },
        ],
      },
      /**END Abner */
    ],
  },
];
