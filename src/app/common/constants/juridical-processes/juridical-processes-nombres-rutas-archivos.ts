import { IMenuItem } from "src/app/core/interfaces/menu.interface";

export const baseMenu: string = "/pages/juridicos/"; // Base url Menu
export const baseMenuDepositaria: string = "depositaria/"; // Base url Menu Depositaria
// NOMBRE PANTALLA, LINK NOMBRE PANTALLA EN INGLES, NOMBRE OPCION MENU
export const routesJuridicalProcesses: any =
[
  {
    label: 'Dictaminaciones Juridicas', link: 'dictaminaciones-juridicas', menu: 'Dictaminaciones Juridicas' 
  },
  {
    label: 'Actualización de Datos del Expediente', link: 'actualizacion-datos-expediente', menu: 'Actualización de Expediente' 
  },
  {
    label: 'Actualización de Expedientes en Notificación', link: 'actualizacion-expedientes-notificacion', menu: 'Actualización de Expedientes en Notificación' 
  },
  {
    label: 'Declaratoria y Oficios de Abandonos', link: 'abandonos', menu: 'Abandonos' 
  },
  // DEPOSITARIA
  {
    label: 'Nombranientos', link: 'registro-depositaria', menu: 'Registro de Depositaría' 
  }
  // DEPOSITARIA
]
export const menuOptionsJuridicalProcesses: IMenuItem =
    
  // PROCESOS JURIDICOS
  {
    label: 'Procesos Jurídicos',
    icon: 'bx-share-alt',
    subItems: [
      { 
        label: routesJuridicalProcesses[0].menu, 
        link: baseMenu + routesJuridicalProcesses[0].link
      },
      {
        label: routesJuridicalProcesses[1].menu, 
        link: baseMenu + routesJuridicalProcesses[1].link
      },
      {
        label: routesJuridicalProcesses[2].menu, 
        link: baseMenu + routesJuridicalProcesses[2].link
      },
      {
        label: routesJuridicalProcesses[3].menu, 
        link: baseMenu + routesJuridicalProcesses[3].link
      },
      {
        label: 'Depositaría',
        subItems: [
          {
            label: routesJuridicalProcesses[4].menu, 
            link: baseMenu + baseMenuDepositaria + routesJuridicalProcesses[4].link
          },
        ],
      },
    ],
  }
  // PROCESOS JURIDICOS
