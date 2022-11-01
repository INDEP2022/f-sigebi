import { CREAR_MENU_DEPOSITARY } from './depositary-routes';
import { CREAR_MENU_JURIDICAL_PROCESSES } from './juridical-processes-routes';

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
  {
    // Seguimiento a Juicios
    label: 'Seguimiento a Juicios',
    link: 'seguimiento-juicios',
    menu: 'Seguimiento a Juicios',
  },
  {
    // Lista - Monitor de Abandono por Devolución
    label: 'Lista - Monitor de Abandono por Devolución',
    link: 'monitor-abandono-devolucion',
    menu: 'Lista - Monitor de Abandono por Devolución',
  },
  {
    // Formulario - Monitor Abandono por Devolución
    label: 'Formulario - Monitor Abandono por Devolución',
    link: 'abandono-devolucion-monitor',
    menu: 'Formulario - Monitor Abandono por Devolución',
  },
  {
    // Declaración de Abandono por Aseguramiento
    label: 'Declaración de Abandono por Aseguramiento',
    link: 'declaracion-abandono-aseguramiento',
    menu: 'Declaración de Abandono por Aseguramiento',
  },
  {
    // Dictaminaciones juridicas mantenimiento
    label: 'Dictaminaciones Juridicas Mantenimiento',
    link: 'dictaminaciones-juridicas-mantenimiento',
    menu: 'Dictaminaciones Juridicas Mantenimiento',
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
      ...CREAR_MENU_JURIDICAL_PROCESSES(),
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
