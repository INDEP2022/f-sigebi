import { DOCUMENTS_RECEPTION_ROUTES } from '../common/routes/documents-reception.routes';
import { menuOptionsJuridicalProcesses } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { IMenuItem } from './interfaces/menu.interface';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { ADMINISTRATIVE_PROCESSES_ROUTES } from '../common/routes/administrative-processes.routes'
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
    ],
  },
  ...DOCUMENTS_RECEPTION_ROUTES,
  //Procesos ejecutivos
  {
    label: 'Procesos Ejecutivos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Reportes del Director Gral',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Total de documentos recibidos vs área destino',
            link: '/pages/executive-processes/pe-rddg-drpad-m-totaldoc-received-destinationarea',
          },
          {
            label: 'Reporte Documentación Recibida',
            link: '/pages/executive-processes/pe-rddg-tddr-m-report-doc-received',
          },
          {
            label: 'Reporte de bienes recibidos en administración',
            link: '/pages/executive-processes/pe-rddg-brea-m-assets-received-admon',
          },
        ],
      },
      {
        label: 'Acumulado Anual de Bienes',
        link: '/pages/executive-processes/pe-aab-m-annual-accumulated-assets',
      },
      {
        label: 'Acumulado Trimestral de Bienes',
        link: '/pages/executive-processes/pe-atb-m-quarterly-accumulated-assets',
      },
      {
        label: 'Control Mensual de Recepción Documental',
        link: '/pages/executive-processes/pe-cmrd-m-cumulative-goods',
      },
      {
        label: 'Control diario de recepción de expedientes',
        link: '/pages/executive-processes/pe-rdde-m-daily-control-reception',
      },
      {
        label: 'información Bienes',
        link: '/pages/executive-processes/pe-ibs-d-a-m-report-registration-module',
      },
      {
        label: 'Reporte de documentación recibida por autoridad emisora ',
        link: '/pages/executive-processes/pe-drpae-m-doc-received-authority',
      },
      {
        label: 'Gestión de Autorización de Destrucción',
        link: '/pages/executive-processes/pe-gdadd-m-destruction-authorization-management',
      },
      {
        label: 'Autorización de bienes para destrucción ',
        link: '/pages/executive-processes/pe-ad-m-authorization-assets-destruction',
      },
      {
        label: 'Aprobación de bienes para destino',
        link: '/pages/executive-processes/pe-ad-m-approval-assets-destination',
      },
      {
        label: 'Recepción recibida por área en el SERA ',
        link: '/pages/executive-processes/pe-rddxdees-m-reception-area-sera',
      },
      {
        label: 'Proceso de actualización masiva de valor avaluó',
        link: '/pages/executive-processes/pe-amdvda-m-update-mss-value',
      },
      {
        label: 'Aprobación donación',
        link: '/pages/executive-processes/pe-ad-m-donation-approval',
      },
    ],
  },
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
        label: 'Activos Financieros',
        icon: 'credit-card-outline',
        subItems: [],
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
    ],
  },
  // PROCESOS JURIDICOS
  menuOptionsJuridicalProcesses,
  // PROCESOS JURIDICOS
];
