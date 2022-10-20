import { DOCUMENTS_RECEPTION_ROUTES } from '../common/routes/documents-reception.routes';
import { MENU_OPTIONS_JURIDICAL_PROCESSES } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { IMenuItem } from './interfaces/menu.interface';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { EXECUTIVE_PROCESSES_ROUTES } from '../common/routes/executive-processes.routes';
import { ADMINISTRATIVE_PROCESSES_ROUTES } from '../common/routes/administrative-processes.routes';

export const MENU: IMenuItem[] = [
  {
    label: 'Menu',
    isTitle: true,
  },
  {
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/pages/home',
  },
  // {
  //     isLayout: true
  // },
  // {
  //     label: 'Aplicaciones',
  //     isTitle: true
  // },
  {
    label: 'Documentation',
    icon: 'bx-home-circle',
    link: '/pages/documentation',
  },
  {
    label: 'Ejemplo',
    icon: 'bx-calendar',
    link: '/pages/example',
  },
  // * CATALOGOS
  ...CATALOGS_ROUTES,
  //Administración
  {
    label: 'Procesos Administrativos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Numerario Físico',
        link: '/pages/administrative-processes/numerary-physics',
      },
      {
        label: 'Actas Conversión',
        link: '/pages/administrative-processes/conversion-act',
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
        label: 'Solicitud de Avalúos',
        link: '/pages/administrative-processes/appraisal-request',
      },
      {
        label: 'Solicitud de cambio a numeración',
        link: '/pages/administrative-processes/request-numbering-change',
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
    ],
  },
  {
    label: 'Reportes',
    icon: 'bx-folder',
    subItems: [
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
      /**
       * ADMIN PROCESS-SEGUROS LEGASPI
       **/
      /**
       * ADMIN PROCESS-SERVICES LEGASPI
       **/
      {
        label: 'Servicios',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Registro de Pago de Servicios',
            link: '/pages/administrative-processes/services/',
          },
          {
            label: 'Solicitud de Pago de Servicios',
            link: '/pages/administrative-processes/services/request',
          },
        ],
      },
      {
        label: 'Acumulado de bienes mensual',
        link: '/pages/administrative-processes/accumulated-monthly-assets',
      },

      /**
       * ADMIN PROCESS-SERVICES LEGASPI
       **/
    ],
  },
  {
    label: 'Solicitudes',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Solicitudes a turno',
        link: '/pages/request/request-in-turn',
      },
      {
        label: 'Solicitudes',
        link: '/pages/request/list',
      },
    ],
  },
  //Proceso Destino final
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
        ],
      },
    ],
  },
  ...DOCUMENTS_RECEPTION_ROUTES,
  //Procesos ejecutivos
  ...EXECUTIVE_PROCESSES_ROUTES,
  //Comercialización
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
            label: 'Causas y Refacturación',
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
    ],
  },
  // PROCESOS JURIDICOS
  ...MENU_OPTIONS_JURIDICAL_PROCESSES,
  // Recepcion Fisica Judicial
  {
    label: 'Recepcion Fisica Judicial',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Complemento Arituclo',
        link: '/pages/judicial-physical-reception/articles-complement',
      },
      {
        label: 'Recepcion de Decomisos',
        link: '/pages/judicial-physical-reception/confiscated-reception',
      },
      {
        label: 'Reporte de Actas',
        link: '/pages/judicial-physical-reception/records-report',
      },
      {
        label: 'Actas de Recepcion',
        link: '/pages/judicial-physical-reception/confiscated-records',
      },
    ],
  },
];
