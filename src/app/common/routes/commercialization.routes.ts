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
            link: '/pages/commercialization/c-b-f-fmdvdb-m-event-preparation',
          },
          {
            label: 'Bienes exentos de validación',
            link: '/pages/commercialization/c-b-bedv-m-validation-exempted-goods',
          },
          {
            label: 'Reclasificacón OI',
            link: '/pages/commercialization/c-b-rdodi-m-reclass-recovery-orders',
          },
          {
            label: 'Validación de Pagos',
            link: '/pages/commercialization/c-b-vdp-m-payment-dispersion-validation',
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
            link: '/pages/commercialization/c-b-a-cda-m-appraisal-consultation',
          },
          {
            label: 'Registro de Avalúo',
            link: '/pages/commercialization/c-b-a-rda-m-appraisal-registration',
          },
          {
            label: 'Captura de Gastos',
            link: '/pages/commercialization/c-b-ge-cdg-m-expense-capture',
          },
          {
            label: 'Terceros comercializadores',
            link: '/pages/commercialization/c-bm-ge-cdc-tc-m-third-party-marketers',
          },
          {
            label: 'Consulta de bienes',
            link: '/pages/commercialization/consultation-goods-commercial-process-tabs',
          },
          {
            label: 'Calcular comisión',
            link: '/pages/commercialization/c-bm-ge-cdc-clc-m-calculate-commission',
          },
          {
            label: 'Folios y Series',
            link: '/pages/commercialization/c-bm-f-syf-m-series-folios-control',
          },
          {
            label: 'Causas de Refacturación',
            link: '/pages/commercialization/c-bm-f-cdr-m-rebilling-causes',
          },
          {
            label: 'Estatus de la facturación',
            link: '/pages/commercialization/c-bm-f-edf-m-invoice-status',
          },
          {
            label: 'Conceptos de Gasto',
            link: '/pages/commercialization/expense-concepts',
          },
          {
            label: 'Permisos a Eventos',
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
            link: '/pages/commercialization/c-bm-f-fr-cr-m-rectification-fields',
          },
          {
            label: 'Formato de rectificación',
            link: '/pages/commercialization/c-bm-f-fr-prdf-m-invoice-rectification-process',
          },
          {
            label: 'Configuración de Página',
            link: '/pages/commercialization/c-bm-vm-m-cp-page-setup',
          },
          {
            label: 'Catálogo de Entidades',
            link: '/pages/commercialization/c-bm-vm-cde-m-entity-classification',
          },
          {
            label: 'Reporte de Ingresos por Mandato',
            link: '/pages/commercialization/mandate-income-reports',
          },
          {
            label: 'Remesas registradas por regional',
            link: '/pages/commercialization/c-bm-r-rrpr-m-remittances-recorded-region',
          },
          {
            label: 'Exportación de las Remesas',
            link: '/pages/commercialization/c-bm-r-exdlr-m-remittance-exportation',
          },
          {
            label: 'Catálogos Auxiliares para Firmas Electrónicas',
            link: '/pages/commercialization/c-b-r-oim-electronic-signature-auxiliary-catalogs/movable',
          },
          {
            label: 'Envío de Movimientos a SIRSAE',
            link: '/pages/commercialization/c-b-ems-sirsae-movement-sending/movable',
          },
          {
            label: 'Ejecución de la Conciliación',
            link: '/pages/commercialization/c-b-pdp-ec-conciliation-execution/movable',
          },
        ],
      },
      {
        label: 'Bienes Inmuebles',
        icon: 'home-outline',
        subItems: [
          {
            label: 'Bienes exentos de validación',
            link: '/pages/commercialization/c-b-bedv-m-validation-exempted-goods',
          },
          {
            label: 'Reclasificacón OI',
            link: '/pages/commercialization/c-b-rdodi-m-reclass-recovery-orders',
          },
          {
            label: 'Validación de Pagos',
            link: '/pages/commercialization/c-b-vdp-m-payment-dispersion-validation',
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
            link: '/pages/commercialization/c-b-a-cda-m-appraisal-consultation',
          },
          {
            label: 'Registro de Avalúo',
            link: '/pages/commercialization/c-b-a-rda-m-appraisal-registration',
          },
          {
            label: 'Captura de Gastos',
            link: '/pages/commercialization/c-b-ge-cdg-m-expense-capture',
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
            label: 'Permisos a Eventos',
            link: '/pages/commercialization/events',
          },
          {
            label: 'Reporte de Ingresos por Mandato',
            link: '/pages/commercialization/mandate-income-reports',
          },
          {
            label: 'Envío de Movimientos a SIRSAE',
            link: '/pages/commercialization/c-b-ems-sirsae-movement-sending/immovable',
          },
          {
            label: 'Ejecución de la Conciliación',
            link: '/pages/commercialization/c-b-pdp-ec-conciliation-execution/immovable',
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
            label: 'Tipos de penalización',
            link: '/pages/commercialization/catalogs/penalty-types',
          },
          {
            label: 'Claves autorización envío ext. OIs',
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
    ],
  },
];
