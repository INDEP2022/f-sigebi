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
    link: 'declaratoria-oficios-abandonos',
    menu: 'Abandonos',
  },
  {
    // BIENES EN PROCESO DE VALIDACIÓN EXT_DOM
    label: 'Bienes en Proceso de Validación EXT_DOM',
    link: 'bienes-validacion-aseg-extdom',
    menu: 'Bienes Validación ASEG_EXTDOM',
  },
  {
    // Quitar Desahogo
    label: 'Quitar Desahogo',
    link: 'quitar-desahogo',
    menu: 'Quitar Desahogo',
  },
  {
    // Abandonos
    label: 'Abandonos',
    link: 'abandonos',
    menu: 'Aplicar Abandono',
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
        // BIENES EN PROCESO DE VALIDACIÓN EXT_DOM
        label: routesJuridicalProcesses[4].menu,
        link: baseMenu + routesJuridicalProcesses[4].link,
      },
      {
        // DESAHOGO Quitar Desahogo
        label: routesJuridicalProcesses[5].menu,
        link: baseMenu + routesJuridicalProcesses[5].link,
      },
      {
        // Abandonos
        label: routesJuridicalProcesses[6].menu,
        link: baseMenu + routesJuridicalProcesses[6].link,
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
