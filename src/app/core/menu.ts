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
  ...ADMINISTRATIVE_PROCESSES_ROUTES,
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
        label: 'Solicitudes de transferencia',
        link: '/pages/request/transfer-request',
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
        label: 'Exportación de Bienes para Donación a Excel',
        subItems: [
          {
            label: 'Exportación de Bienes para Donación',
            link: '/pages/final-destination-process/donation-process/export-goods-donation',
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
        label: 'Conversión a numerario',
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
