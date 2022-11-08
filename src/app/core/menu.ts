import { MENU_OPTIONS_JURIDICAL_PROCESSES } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { MENU_OPTIONS_SECURITY } from '../common/constants/security/security-menu';
import { ADMINISTRATIVE_PROCESSES_ROUTES } from '../common/routes/administrative-processes.routes';
import { CATALOGS_ROUTES } from '../common/routes/catalogs.routes';
import { COMMERCIALIZATION_ROUTES } from '../common/routes/commercialization.routes';
import { DOCUMENTATION_COMPLEMENTARY } from '../common/routes/documentation-complementary';
import { DOCUMENTS_RECEPTION_ROUTES } from '../common/routes/documents-reception.routes';
import { EXECUTIVE_PROCESSES_ROUTES } from '../common/routes/executive-processes.routes';
import { GENERAL_PROCESSES_ROUTES } from '../common/routes/general-processes.routes';
import { PARAMETERIZATION_ROUTES } from '../common/routes/parameterization.routes';
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
      {
        label: 'Gestionar Bienes Similares',
        subItems: [
          {
            label: 'Documentación Complementaria',
            link: '/pages/request/manage-similar-goods/register-additional-documentation',
          },
        ],
      },
    ],
  },

  //Documentación complementaria//
  ...DOCUMENTATION_COMPLEMENTARY,

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
            label: 'Registro de Inventarios para Donación Directa',
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
  },
  ...DOCUMENTS_RECEPTION_ROUTES,
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
    ],
  },

  //Parametrización
  ...PARAMETERIZATION_ROUTES,
];
