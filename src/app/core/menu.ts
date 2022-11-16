import { MENU_OPTIONS_JURIDICAL_PROCESSES } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { ADMINISTRATIVE_PROCESSES_ROUTES } from '../common/routes/administrative-processes.routes';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { DOCUMENTS_RECEPTION_ROUTES } from '../common/routes/documents-reception.routes';
import { EXECUTIVE_PROCESSES_ROUTES } from '../common/routes/executive-processes.routes';
import { GENERAL_PROCESSES_ROUTES } from '../common/routes/general-processes.routes';
import { REGISTRATION_REQUEST_ROUTES } from '../common/routes/registration-request.routes';
import { IMenuItem } from './interfaces/menu.interface';

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
        label: 'Solicitudes',
        link: '/pages/request/list',
      },
    ],
  },

  // Registro solicitudes//
  ...REGISTRATION_REQUEST_ROUTES,

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
          {
            label: 'Solicitud y Autorización de Donación',
            link: '/pages/final-destination-process/donation-process/donation-authorization-request',
          },
          //VISTAS A LAS QUE SE LES DEBE VERIFICAR SU RUTA
          {
            label: 'Parcialización Bienes en Donación',
            link: '/pages/final-destination-process/donation-process/partialization-goods-donation',
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
    ],
  },
  ...DOCUMENTS_RECEPTION_ROUTES,
  ...GENERAL_PROCESSES_ROUTES,
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
            link: '/pages/commercialization/mandate-income-reports'
          },
          {
            label: 'Remesas registradas por regional',
            link: '/pages/commercialization/c-bm-r-rrpr-m-remittances-recorded-region',
          },
          {
            label: 'Exportación de las Remesas',
            link: '/pages/commercialization/c-bm-r-exdlr-m-remittance-exportation',
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
            link: '/pages/commercialization/mandate-income-reports'
          }
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
        label: 'Complemento Aritculo',
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
      {
        label: 'Parcializa Bienes Generales 1',
        link: '/pages/judicial-physical-reception/partializes-general-goods-1',
      },

      {
        label: 'Parcializa Bienes Generales 2',
        link: '/pages/judicial-physical-reception/partializes-general-goods-2',
      },
      {
        label: 'Parcializaciond de Bienes',
        link: '/pages/judicial-physical-reception/partializes-goods',
      },
      {
        label: 'Recepcion Suspencion/Cancelacion',
        link: '/pages/judicial-physical-reception/cancellation-recepcion',
      },
      {
        label: 'Devolucion x Cancelacion de Venta',
        link: '/pages/judicial-physical-reception/cancellation-sale',
      },
      {
        label: 'Mantenimiento de Programaciones',
        link: '/pages/judicial-physical-reception/scheduled-maintenance-1',
      },
      {
        label: 'Mantenimiento de Acta Entrega Recepcion',
        link: '/pages/judicial-physical-reception/scheduled-maintenance-2',
      },
       {
        label: 'Mantenimiento de Acatas',
        link: '/pages/judicial-physical-reception/maintenance-records',
      },
    ],
  },
];
