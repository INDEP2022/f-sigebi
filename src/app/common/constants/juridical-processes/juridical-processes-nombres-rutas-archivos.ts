import { CREAR_MENU_DEPOSITARY } from './depositary-routes';

export const baseMenu: string = '/pages/juridicos/'; // Base url Menu
export const baseMenuDepositaria: string = 'depositaria/'; // Base url Menu Depositaria
export const baseMenuProcesoDispercionPagos: string =
  'procesos-dispercion-pagos/'; // Base url Menu ProcesoDispercionPagos
export const baseMenuFormalizacionInmuebles: string =
  'formalizacion-inmuebles/'; // Base url Menu FormalizacionInmuebles
// NOMBRE PANTALLA, LINK NOMBRE PANTALLA EN INGLES, NOMBRE OPCION MENU
export const routesJuridicalProcesses: any = [
  {
    // DICTAMINACIONES JURIDICAS
    label: 'Dictaminaciones Juridicas',
    link: 'dictaminaciones-juridicas',
    menu: 'Dictaminaciones Juridicas',
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE
    label: 'Actualización de Datos del Expediente',
    link: 'actualizacion-datos-expediente',
    menu: 'Actualización de Expediente',
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE EN NOTIFICACIÓN
    label: 'Actualización de Expedientes en Notificación',
    link: 'actualizacion-expedientes-notificacion',
    menu: 'Actualización de Expedientes en Notificación',
  },
  {
    // DECLARATORIA Y OFICIOS DE ABANDONOS
    label: 'Declaratoria y Oficios de Abandonos',
    link: 'abandonos',
    menu: 'Abandonos',
  },
];
export const routesFormalizacionInmuebles: any = [
  {
    // Capturas de Abogados Formalizadores
    label: 'Capturas de Abogados Formalizadores',
    link: 'abogados-formalizadores',
    menu: 'Abogados Formalizadores',
  },
  {
    // Formalización de Bienes Inmuebles
    label: 'Formalización de Bienes Inmuebles',
    link: 'proceso-formalizacion',
    menu: 'Proceso de Formalización',
  },
];
export const MENU_OPTIONS_JURIDICAL_PROCESSES = [
  // PROCESOS JURIDICOS
  {
    label: 'Procesos Jurídicos',
    icon: 'bx-share-alt',
    subItems: [
      {
        // DICTAMINACIONES JURIDICAS
        label: routesJuridicalProcesses[0].menu,
        link: baseMenu + routesJuridicalProcesses[0].link + '/12345',
      },
      {
        // ACTUALIZACIÓN DE EXPEDIENTE
        label: routesJuridicalProcesses[1].menu,
        link: baseMenu + routesJuridicalProcesses[1].link + '/12345',
      },
      {
        // ACTUALIZACIÓN DE EXPEDIENTE EN NOTIFICACIÓN
        label: routesJuridicalProcesses[2].menu,
        link: baseMenu + routesJuridicalProcesses[2].link,
      },
      {
        // DECLARATORIA Y OFICIOS DE ABANDONOS
        label: routesJuridicalProcesses[3].menu,
        link: baseMenu + routesJuridicalProcesses[3].link,
      },
      {
        label: 'Depositaría',
        subItems: CREAR_MENU_DEPOSITARY(),
      },
      {
        label: 'Formalización de Inmuebles',
        subItems: [
          {
            // Capturas de Abogados Formalizadores
            label: routesFormalizacionInmuebles[0].menu,
            link:
              baseMenu +
              baseMenuFormalizacionInmuebles +
              routesFormalizacionInmuebles[0].link,
          },
          {
            // Formalización de Bienes Inmuebles
            label: routesFormalizacionInmuebles[1].menu,
            link:
              baseMenu +
              baseMenuFormalizacionInmuebles +
              routesFormalizacionInmuebles[1].link,
          },
        ],
      },
    ],
  },
  // PROCESOS JURIDICOS
];
