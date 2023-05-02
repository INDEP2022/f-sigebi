import { MENU_OPTIONS_JURIDICAL_PROCESSES } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { MENU_OPTIONS_REQUEST_MANAGE_RETURN } from '../common/constants/request/manage-return/menu-manage-return';
import { MENU_OPTIONS_SECURITY } from '../common/constants/security/security-menu';
import { ADMINISTRATIVE_PROCESSES_ROUTES } from '../common/routes/administrative-processes.routes';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { COMMERCIALIZATION_ROUTES } from '../common/routes/commercialization.routes';
import { DOCUMENTATION_COMPLEMENTARY } from '../common/routes/documentation-complementary';
import { DOCUMENTS_RECEPTION_ROUTES } from '../common/routes/documents-reception.routes';
import { EXECUTIVE_PROCESSES_ROUTES } from '../common/routes/executive-processes.routes';
import { FINAL_DESTINATION_PROCESS_ROUTES } from '../common/routes/final-destination-process.routes';
import { GENERAL_PROCESSES_ROUTES } from '../common/routes/general-processes.routes';
import { JUDICIAL_PHYSICAL_RECEPTION_ROUTES } from '../common/routes/judicial-physical-reception.routes';
import { MASTER_FILES } from '../common/routes/master-file.routes';
import { PARAMETERIZATION_ROUTES } from '../common/routes/parameterization.routes';
import { SCHEDULING_DELIVERIES } from '../common/routes/scheduling-deliveries.routes';
import { APPRAISALS_ROUTES } from '../common/routes/siab-web/appraisals.routes';
import { CLAIMS_CONTROL_ROUTES } from '../common/routes/siab-web/claims-control.routes';
import { COMMERCIALIZATION_SW_ROUTES } from '../common/routes/siab-web/commercialization-sw.routes';
import { CONSULTATION_ROUTES } from '../common/routes/siab-web/consultation.routes';
import { INDICATORS_ROUTES } from '../common/routes/siab-web/indicators.routes';
import { MAINTENANCE_ROUTES } from '../common/routes/siab-web/maintenance.routes';
import { PARAMETRIZATION_ROUTES } from '../common/routes/siab-web/parametrization.routes';
import { SAMI_ROUTES } from '../common/routes/siab-web/simi.routes';
import { IMenuItem } from './interfaces/menu.interface';

export const MENU: IMenuItem[] = [
  /*SIAB ROUTES*/
  {
    label: 'SIAB',
    icon: 'bx-folder',
    subItems: [
      // * CATALOGOS
      ...CATALOGS_ROUTES,
      //Administración
      ...ADMINISTRATIVE_PROCESSES_ROUTES,
      //Archivo General
      ...MASTER_FILES,
      //Documentación complementaria
      ...DOCUMENTATION_COMPLEMENTARY,
      //Programar entregas
      ...SCHEDULING_DELIVERIES,
      //Proceso Destino final
      ...FINAL_DESTINATION_PROCESS_ROUTES,
      //Recepcion documental
      ...DOCUMENTS_RECEPTION_ROUTES,
      //Procesos generales
      ...GENERAL_PROCESSES_ROUTES,
      //Procesos ejecutivos
      ...EXECUTIVE_PROCESSES_ROUTES,
      //Comercialización
      ...COMMERCIALIZATION_ROUTES,
      // PROCESOS JURIDICOS
      ...MENU_OPTIONS_JURIDICAL_PROCESSES,
      // SEGURIDAD
      ...MENU_OPTIONS_SECURITY,
      // Recepcion Fisica Judicial
      ...JUDICIAL_PHYSICAL_RECEPTION_ROUTES,
      //Parametrización
      ...PARAMETERIZATION_ROUTES,
    ],
  },
  /*SIAB-WEB ROUTES*/
  {
    label: 'SIAB-WEB',
    icon: 'bx-folder',
    subItems: [
      ...COMMERCIALIZATION_SW_ROUTES,
      ...SAMI_ROUTES,
      ...APPRAISALS_ROUTES,
      ...INDICATORS_ROUTES,
      ...PARAMETRIZATION_ROUTES,
      ...CONSULTATION_ROUTES,
      ...CLAIMS_CONTROL_ROUTES,
      ...MAINTENANCE_ROUTES,
    ],
  },
  /*SAMI ROUTES*/
  {
    label: 'SAMI',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Applicaciones',
        subItems: [
          {
            label: 'Solicitud de transferencia',
            link: '/pages/request/list/new-transfer-request',
          },
          {
            label: 'Muestreo Bienes',
            link: '/pages/request/sampling-assets',
          },
          {
            label: 'Genera Consultas',
            link: '/pages/request/generate-sampling-service-orders/generate-query',
          },
          {
            label: 'Solicitud de Documentación Complementaria',
            link: '/pages/request/request-comp-doc',
          },
        ],
      },
      // APP -- GESTIONAR DEVOLUCION -- Registro de Solicitud de Devolución
      { ...MENU_OPTIONS_REQUEST_MANAGE_RETURN },
      {
        label: 'Turnado Masivo Solicitudes',
        link: '/pages/request/request-in-turn',
      },
      {
        label: 'Lista de Solicitudes',
        link: '/pages/request/list',
      },
      {
        label: 'Gestionar Bienes Similares',
        subItems: [
          {
            label: 'Documentación Complementaria',
            link: '/pages/request/manage-similar-goods/register-additional-documentation',
          },
        ],
      },
      {
        label: 'Solicitud de Información de Destino',
        subItems: [
          {
            label: 'Listado de Solicitudes',
            link: '/pages/request/destination-information-request/list',
          },
        ],
      },
    ],
    /*subItems: [
      {
        label: 'Transferencia de Bienes',
        icon: 'bx-folder',
        ,
      },
    ]*/
  },
  /*{
    label: 'Menu',
    isTitle: true,
  },
  {
    label: 'page',
    icon: 'bx-home-circle',
    link: '/pages/home',
  },*/
  // {
  //     isLayout: true
  // },
  // {
  //     label: 'Aplicaciones',
  //     isTitle: true
  // },
  /*{
    label: 'Documentation',
    icon: 'bx-home-circle',
    link: '/pages/documentation',
  },
  {
    label: 'Ejemplo',
    icon: 'bx-calendar',
    link: '/pages/example',
  },*/
  /*LISTO*/
  // * CATALOGOS
  /*...CATALOGS_ROUTES,
  //Administración
  ...ADMINISTRATIVE_PROCESSES_ROUTES,
  //Archivo General
  ...MASTER_FILES,*/

  /**LISTO SAMI*/
  /*{
    label: 'Transferencia de Bienes',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Applicaciones',
        subItems: [
          {
            label: 'Solicitud de transferencia',
            link: '/pages/request/list/new-transfer-request',
          },
          {
            label: 'Muestreo Bienes',
            link: '/pages/request/sampling-assets',
          },
          {
            label: 'Genera Consultas',
            link: '/pages/request/generate-sampling-service-orders/generate-query',
          },
          {
            label: 'Solicitud de Documentación Complementaria',
            link: '/pages/request/request-comp-doc',
          },
        ],
      },
      // APP -- GESTIONAR DEVOLUCION -- Registro de Solicitud de Devolución
      { ...MENU_OPTIONS_REQUEST_MANAGE_RETURN },
      {
        label: 'Turnado Masivo Solicitudes',
        link: '/pages/request/request-in-turn',
      },
      {
        label: 'Lista de Solicitudes',
        link: '/pages/request/list',
      },
      {
        label: 'Gestionar Bienes Similares',
        subItems: [
          {
            label: 'Documentación Complementaria',
            link: '/pages/request/manage-similar-goods/register-additional-documentation',
          },
        ],
      },
      {
        label: 'Solicitud de Información de Destino',
        subItems: [
          {
            label: 'Listado de Solicitudes',
            link: '/pages/request/destination-information-request/list',
          },
        ],
      },
    ],
  },*/

  /*LISTO*/
  /*
  //Documentación complementaria//
  ...DOCUMENTATION_COMPLEMENTARY,

  //Programar entregas//
  ...SCHEDULING_DELIVERIES,*/
  /*LISTO*/
  //Proceso Destino final
  /*{
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
  },*/
  /*LISTO*/
  /*
  ...DOCUMENTS_RECEPTION_ROUTES,
  ...GENERAL_PROCESSES_ROUTES,
  //Procesos ejecutivos
  ...EXECUTIVE_PROCESSES_ROUTES,
  //Comercialización
  ...COMMERCIALIZATION_ROUTES,
  // PROCESOS JURIDICOS
  ...MENU_OPTIONS_JURIDICAL_PROCESSES,
  // SEGURIDAD
  ...MENU_OPTIONS_SECURITY,*/
  /*LISTO*/
  // Recepcion Fisica Judicial
  /*{
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
  },*/

  //Bienes Para estudio
  {
    label: 'BIENES PARA ESTUDIO',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Lista de Asignaciones',
        link: '/pages/assets-for-study/assignment-list',
      },
      {
        label: 'Generar Solicitud',
        link: '/pages/assets-for-study/generate-request',
      },

      //David routes
      {
        label: 'Clasificar bienes programados',
        link: '/pages/assets-for-study/clasify-programmed-goods',
      },
      {
        label:
          'Generar e imprimir constancia de bienes programados y no aceptados',
        link: '/pages/assets-for-study/generate-document-of-programmed-goods',
      },
    ],
  },
  /*LISTO*/
  /*//Parametrización
  ...PARAMETERIZATION_ROUTES,*/

  /*LISTO SIAB WEB*/
  /*
  {
    label: 'Siab Web',
    icon: 'bx-folder',
    subItems: [
      ...COMMERCIALIZATION_SW_ROUTES,
      ...SAMI_ROUTES,
      ...APPRAISALS_ROUTES,
      ...INDICATORS_ROUTES,
      ...PARAMETRIZATION_ROUTES,
      ...CONSULTATION_ROUTES,
      ...CLAIMS_CONTROL_ROUTES,
      ...MAINTENANCE_ROUTES,
    ],
  },*/
];
