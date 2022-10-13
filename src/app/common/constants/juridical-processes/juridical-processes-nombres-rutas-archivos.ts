import { IMenuItem } from "src/app/core/interfaces/menu.interface";

export const baseMenu: string = "/pages/juridicos/"; // Base url Menu
export const baseMenuDepositaria: string = "depositaria/"; // Base url Menu Depositaria
export const baseMenuProcesoDispercionPagos: string = "procesos-dispercion-pagos/"; // Base url Menu ProcesoDispercionPagos
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
  },
  {
    label: 'Conciliación de Pagos Depositarias', link: 'conciliacion-pagos-depositaria', menu: 'Proceso de Disperción de Pagos' 
  },
  {
    label: 'Consulta de Pagos Relacionados Depositarias', link: 'consulta-pagos-relacionados-depositaria', menu: 'Validación de Pagos' 
  },
  {
    label: 'Solicitud de Destino Legal para el Bien', link: 'solicitud-monitor-depositaria', menu: 'Solicitud/Monitor de Depositaría' 
  },
  {
    label: 'Reporte de Cédulas de Nombramiento', link: 'reporte-cedulas-nombramiento', menu: 'Reporte de Cédulas de Nombramiento' 
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
        link: baseMenu + routesJuridicalProcesses[0].link + "/12345"
      },
      {
        label: routesJuridicalProcesses[1].menu, 
        link: baseMenu + routesJuridicalProcesses[1].link + "/12345"
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
          // Proceso de Dispersión de Pagos
          {
            label: routesJuridicalProcesses[5].menu, 
            link: baseMenu + baseMenuDepositaria + baseMenuProcesoDispercionPagos + routesJuridicalProcesses[5].link
          },
          {
            label: routesJuridicalProcesses[6].menu, 
            link: baseMenu + baseMenuDepositaria + baseMenuProcesoDispercionPagos + routesJuridicalProcesses[6].link
          },
          {
            label: routesJuridicalProcesses[7].menu, 
            link: baseMenu + baseMenuDepositaria + routesJuridicalProcesses[7].link
          },
          {
            label: routesJuridicalProcesses[8].menu, 
            link: baseMenu + baseMenuDepositaria + routesJuridicalProcesses[8].link
          },
          // Proceso de Dispersión de Pagos
        ],
      },
    ],
  }
  // PROCESOS JURIDICOS
