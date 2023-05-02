import { CREAR_MENU_DEPOSITARY } from './depositary-routes';
import { CREAR_MENU_JURIDICAL_PROCESSES } from './juridical-processes-routes';

// export const baseMenu: string = '/pages/juridicos/'; // Base url Menu
export const baseMenu: string = '/pages/juridical/'; // Base url Menu
// export const baseMenuDepositaria: string = 'depositaria/'; // Base url Menu Depositaria
export const baseMenuDepositaria: string = 'depositary/'; // Base url Menu Depositaria
// export const baseMenuProcesoDispercionPagos: string =
//   'procesos-dispercion-pagos/'; // Base url Menu ProcesoDispercionPagos
export const baseMenuProcesoDispercionPagos: string =
  'payment-dispersion-process/'; // Base url Menu ProcesoDispercionPagos
// export const baseMenuFormalizacionInmuebles: string =
//   'formalizacion-inmuebles/'; // Base url Menu FormalizacionInmuebles
export const baseMenuFormalizacionInmuebles: string = 'property-formalization/'; // Base url Menu FormalizacionInmuebles
// NOMBRE PANTALLA, LINK NOMBRE PANTALLA EN INGLES, NOMBRE OPCION MENU
export const routesJuridicalProcesses: any = [
  {
    // DICTAMINACIONES JURIDICAS
    label: 'Dictaminaciones Juridicas',
    // link: 'dictaminaciones-juridicas',
    link: 'juridical-ruling',
    menu: 'Dictaminaciones Juridicas',
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE
    label: 'Actualización de Datos del Expediente',
    // link: 'actualizacion-datos-expediente',
    link: 'file-data-update',
    menu: 'Actualización de Expediente',
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE EN NOTIFICACIÓN
    label: 'Actualización de Expedientes en Notificación',
    // link: 'actualizacion-expedientes-notificacion',
    link: 'notification-file-update',
    menu: 'Actualización de Expedientes en Notificación',
  },
  {
    // DECLARATORIA Y OFICIOS DE ABANDONOS
    label: 'Declaratoria y Oficios de Abandonos',
    // link: 'declaratoria-oficios-abandonos',
    link: 'abandonments-declaration-trades',
    menu: 'Abandonos',
  },
  {
    // BIENES EN PROCESO DE VALIDACIÓN EXT_DOM
    label: 'Bienes en Proceso de Validación EXT_DOM',
    // link: 'bienes-validacion-aseg-extdom',
    link: 'goods-process-validation-extdom',
    menu: 'Bienes Validación ASEG_EXTDOM',
  },
  {
    // Quitar Desahogo
    label: 'Quitar Desahogo',
    // link: 'quitar-desahogo',
    link: 'relief-delete',
    menu: 'Quitar Desahogo',
  },
  {
    // Abandonos
    label: 'Abandonos',
    // link: 'abandonos',
    link: 'abandonments',
    menu: 'Aplicar Abandono',
  },
  {
    // Seguimiento a Juicios
    label: 'Seguimiento a Juicios',
    // link: 'seguimiento-juicios',
    link: 'tracing-judgment',
    menu: 'Seguimiento a Juicios',
  },
  {
    // Lista - Monitor de Abandono por Devolución
    label: 'Monitor de Abandono por Devolución',
    // link: 'monitor-abandono-devolucion',
    link: 'monitor-return-abandonment',
    menu: 'Monitor de Abandono por Devolución',
  },
  {
    // Formulario - Monitor Abandono por Devolución
    label: 'Monitor Abandono por Devolución',
    // link: 'abandono-devolucion-monitor',
    link: 'return-abandonment-monitor',
    menu: '',
  },
  {
    // Declaración de Abandono por Aseguramiento
    label: 'Declaración de Abandono por Aseguramiento',
    // link: 'declaracion-abandono-aseguramiento',
    link: 'declaration-abandonment-insurance',
    menu: 'Declaración de Abandono por Aseguramiento',
  },
  {
    // Dictaminaciones juridicas mantenimiento
    label: 'Dictaminaciones Juridicas Mantenimiento',
    // link: 'dictaminaciones-juridicas-mantenimiento',
    link: 'maintenance-legal-rulings',
    menu: 'Dictaminaciones Juridicas Mantenimiento',
  },
  {
    // DICTAMINACIONES JURIDICAS-G
    label: 'Dictaminaciones Juridicas-G',
    // link: 'dictaminaciones-juridicas-g',
    link: 'juridical-ruling-g',
    menu: 'Dictaminaciones Juridicas-G',
  },
  {
    // Comprobacion de Documentos para Decomiso
    label: 'Comprobacion de Documentos para Decomiso',
    // link: 'comprobacion-documentos-decomiso',
    link: 'verification-documents-confiscation',
    menu: 'Comprobacion de Documentos para Decomiso',
  },
];
export const routesFormalizacionInmuebles: any = [
  {
    // Capturas de Abogados Formalizadores
    label: 'Capturas de Abogados Formalizadores',
    // link: 'abogados-formalizadores',
    link: 'formalizing-lawyers',
    menu: 'Abogados Formalizadores',
  },
  {
    // Formalización de Bienes Inmuebles
    label: 'Formalización de Bienes Inmuebles',
    // link: 'proceso-formalizacion',
    link: 'formalizing-process',
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
