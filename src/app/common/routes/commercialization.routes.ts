export const COMMERCIALIZATION_ROUTES = [
  {
    label: 'Comercialización',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Bienes Muebles',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Preparación del evento',
            link: '/pages/commercialization/event-preparation',
          },
          {
            label: 'Bienes exentos de validación',
            link: '/pages/commercialization/validation-exempted-goods',
          },
          {
            label: 'Reclasificacón OI',
            link: '/pages/commercialization/reclass-recovery-orders',
          },
          {
            label: 'Validación de Pagos',
            link: '/pages/commercialization/payment-dispersion-validation',
          },
          {
            label: 'Pagos Referenciados',
            link: '/pages/commercialization/referenced-payment',
          },
          {
            label: 'Pagos no Conciliados',
            link: '/pages/commercialization/unreconciled-payment',
          },
          {
            label: 'Dispersión de Pagos',
            link: '/pages/commercialization/payment-dispersion-monitor',
          },
          {
            label: 'Conversión a numerario',
            link: '/pages/commercialization/numeraire-conversion-tabs',
          },
          {
            label: 'Consulta de Avalúo',
            link: '/pages/commercialization/appraisal-consultation',
          },
          {
            label: 'Registro de Avalúo',
            link: '/pages/commercialization/appraisal-registration',
          },
          {
            label: 'Captura de Gastos',
            link: '/pages/commercialization/expense-capture',
          },
          {
            label: 'Terceros comercializadores',
            link: '/pages/commercialization/third-party-marketers',
          },
          {
            label: 'Consulta de bienes',
            link: '/pages/commercialization/consultation-goods-commercial-process-tabs',
          },
          {
            label: 'Calcular comisión',
            link: '/pages/commercialization/calculate-commission',
          },
          {
            label: 'Folios y Series',
            link: '/pages/commercialization/series-folios-control',
          },
          {
            label: 'Causas de Refacturación',
            link: '/pages/commercialization/rebilling-causes',
          },
          {
            label: 'Estatus de la facturación',
            link: '/pages/commercialization/invoice-status',
          },
          {
            label: 'Conceptos de Gasto',
            link: '/pages/commercialization/expense-concepts',
          },
          {
            label: 'Delegar Permisos a Eventos',
            link: '/pages/commercialization/events',
          },
          {
            label: 'Facturación masiva de venta de bases',
            link: '/pages/commercialization/mass-biling-base-sales-tab',
          },
          {
            label: 'Facturación normal',
            link: '/pages/commercialization/regular-billing-tab',
          },
          {
            label: 'Campos Rectificación',
            link: '/pages/commercialization/rectification-fields',
          },
          {
            label: 'Formato de rectificación',
            link: '/pages/commercialization/invoice-rectification-process',
          },
          {
            label: 'Configuración de Página',
            link: '/pages/commercialization/page-setup',
          },
          {
            label: 'Catálogo de Entidades',
            link: '/pages/commercialization/entity-classification',
          },
          {
            label: 'Reporte de Ingresos por Mandato',
            link: '/pages/commercialization/mandate-income-reports',
          },
          {
            label: 'Remesas registradas por regional',
            link: '/pages/commercialization/remittances-recorded-region',
          },
          {
            label: 'Exportación de las Remesas',
            link: '/pages/commercialization/remittance-exportation',
          },
          {
            label: 'Catálogos Auxiliares para Firmas Electrónicas',
            link: '/pages/commercialization/electronic-signature-auxiliary-catalogs/movable',
          },
          {
            label: 'Envío de Movimientos a SIRSAE',
            link: '/pages/commercialization/sirsae-movement-sending/movable',
          },
          {
            label: 'Ejecución de la Conciliación',
            link: '/pages/commercialization/conciliation-execution/movable',
          },
        ],
      },
      {
        label: 'Bienes Inmuebles',
        icon: 'home-outline',
        subItems: [
          {
            label: 'Bienes exentos de validación',
            link: '/pages/commercialization/validation-exempted-goods',
          },
          {
            label: 'Reclasificacón OI',
            link: '/pages/commercialization/reclass-recovery-orders',
          },
          {
            label: 'Validación de Pagos',
            link: '/pages/commercialization/payment-dispersion-validation',
          },
          {
            label: 'Pagos Referenciados',
            link: '/pages/commercialization/referenced-payment',
          },
          {
            label: 'Pagos no Conciliados',
            link: '/pages/commercialization/unreconciled-payment',
          },
          {
            label: 'Dispersión de Pagos',
            link: '/pages/commercialization/payment-dispersion-monitor',
          },
          {
            label: 'Conversión a numerario',
            link: '/pages/commercialization/numeraire-conversion-tabs',
          },
          {
            label: 'Consulta de Avalúo',
            link: '/pages/commercialization/appraisal-consultation',
          },
          {
            label: 'Registro de Avalúo',
            link: '/pages/commercialization/appraisal-registration',
          },
          {
            label: 'Captura de Gastos',
            link: '/pages/commercialization/expense-capture',
          },
          {
            label: 'Consulta de bienes',
            link: '/pages/commercialization/consultation-goods-commercial-process-tabs',
          },
          {
            label: 'Conceptos de Gasto',
            link: '/pages/commercialization/expense-concepts',
          },
          {
            label: 'Delegar Permisos a Eventos',
            link: '/pages/commercialization/events',
          },
          {
            label: 'Reporte de Ingresos por Mandato',
            link: '/pages/commercialization/mandate-income-reports',
          },
          {
            label: 'Envío de Movimientos a SIRSAE',
            link: '/pages/commercialization/sirsae-movement-sending/immovable',
          },
          {
            label: 'Ejecución de la Conciliación',
            link: '/pages/commercialization/conciliation-execution/immovable',
          },
          {
            label: 'Validación de Cálculo I.V.A ',
            link: '/pages/commercialization/tax-validation-calculation',
          },
          {
            label: 'Adjudicaciones Directas en Parcialidades',
            link: '/pages/commercialization/partiality-direct-adjudication',
          },
          {
            label: 'Oficios de Comercialización',
            link: '/pages/commercialization/marketing-records',
          },
        ],
      },
      {
        label: 'Catálogos',
        icon: 'folder',
        subItems: [
          {
            label: 'Tipos de Penalización',
            link: '/pages/commercialization/catalogs/penalty-types',
          },
          {
            label: 'Claves Autorización Envío Ext. OIs',
            link: '/pages/commercialization/catalogs/authorization-keys-ois',
          },
          {
            label: 'Líneas de Captura',
            link: '/pages/commercialization/catalogs/capture-lines',
          },
          {
            label: 'Proveedores',
            link: '/pages/commercialization/catalogs/providers',
          },
          {
            label: 'Clientes',
            link: '/pages/commercialization/catalogs/customers',
          },
          {
            label: 'Penalización de Clientes',
            link: '/pages/commercialization/catalogs/customers-penalties',
          },
          {
            label: 'Tipos de Eventos',
            link: '/pages/commercialization/catalogs/event-types',
          },
          {
            label: 'Estatus de Venta',
            link: '/pages/commercialization/catalogs/sale-status',
          },
          {
            label: 'Estatus de Bienes Disponibles para Comercializar',
            link: '/pages/commercialization/catalogs/goods-available-sale-status',
          },
          {
            label: 'Tipos Movimiento Banco',
            link: '/pages/commercialization/catalogs/bank-movements-types',
          },
          {
            label: 'Parámetros Comercialización',
            link: '/pages/commercialization/catalogs/parameters',
          },
          {
            label: 'Usuarios por Tipo de Evento',
            link: '/pages/commercialization/catalogs/users-event-types',
          },
          {
            label: 'Marcas y Sub Marcas',
            link: '/pages/commercialization/catalogs/brands-sub-brands',
          },
          {
            label: 'Modelos',
            link: '/pages/commercialization/catalogs/models',
          },
          {
            label: 'Eventos por Proceso',
            link: '/pages/commercialization/catalogs/event-process',
          },
          {
            label: 'Registro de Intereses',
            link: '/pages/commercialization/catalogs/registration-of-interest',
          },
        ],
      },
      {
        label: 'Captura de Solicitudes de Venta Directa',
        icon: 'folder',
        subItems: [
          {
            label: 'Control de Municipios',
            link: '/pages/commercialization/direct-sale-requests-capture/municipality-control',
          },
        ],
      },
      {
        label: 'Facturación',
        icon: 'folder',
        subItems: [
          {
            label: 'Facturación de Penalizaciones',
            link: '/pages/commercialization/billing/penalty',
          },
          {
            label: 'Facturación de Venta de Bases',
            link: '/pages/commercialization/billing/bases-sales',
          },
        ],
      },
      {
        label: 'Activos Financieros',
        icon: 'credit-card-outline',
        subItems: [],
      },
      {
        label: 'Conversión a Numerario',
        link: '/pages/commercialization/numeraire-exchange',
      },
      {
        label: 'Consulta de Pagos Sirsae',
        link: '/pages/commercialization/sirsae-payment-consultation',
      },
      {
        label: 'Conversión Masiva de LCs',
        link: '/pages/commercialization/lcs-massive-conversion',
      },
      {
        label: 'Parámetros por Lote',
        link: '/pages/commercialization/batch-parameters',
      },
      {
        label: 'Eventos Relacionados',
        link: '/pages/commercialization/related-events',
      },
      {
        label: 'Búsqueda de Pagos',
        link: '/pages/commercialization/payment-search',
      },
      {
        label: 'Gestión de Firmas Electrónicas',
        link: '/pages/commercialization/electronic-signatures',
      },
      {
        label: 'Devolución de Pagos',
        link: '/pages/commercialization/payment-refund',
      },
      {
        label: 'Entrega de Bienes',
        link: '/pages/commercialization/good-delivery',
      },
      {
        label: 'Reporte de Cartas de Liberacion',
        link: '/pages/commercialization/release-letter-report',
      },
      {
        label: 'Reporte de Cartas de Responsabilidad',
        link: '/pages/commercialization/responsibility-letters-report',
      },
      {
        label: 'Configuracion de Layouts',
        link: '/pages/commercialization/layouts-configuration',
      },
      {
        label: 'Reporte de Notificacion de Adjudicacion Inmuebles',
        link: '/pages/commercialization/property-adjudication-notification-report',
      },
      //Henry2
      {
        label: 'Publicación de fotografías',
        link: '/pages/commercialization/publication-photographs',
      },
      {
        label: 'Reporte de pagos recibidos',
        link: '/pages/commercialization/payment-receipts-report',
      },
      {
        label: 'Reporte de actas de enajenación',
        link: '/pages/commercialization/disposal-record-report',
      },
      {
        label: 'Bienes comercializados',
        link: '/pages/commercialization/traded-goods',
      },
      {
        label: 'Licitación de bienes',
        link: '/pages/commercialization/goods-tenders',
      },
      {
        label: 'Ficha comercial',
        link: '/pages/commercialization/commercial-file',
      },
    ],
  },
];
