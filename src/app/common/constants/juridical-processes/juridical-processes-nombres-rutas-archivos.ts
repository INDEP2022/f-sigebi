import { IMenuItem } from "src/app/core/interfaces/menu.interface";


export const baseMenu: string = "/pages/juridicos/"; // Base url Menu
export const menuOptionsJuridicalProcesses: IMenuItem =//[] = menuGenerator();

// [
    
  // PROCESOS JURIDICOS
  {
    label: 'Procesos Jurídicos',
    icon: 'bx-share-alt',
    subItems: [
      { 
        label: 'Dictaminaciones Juridicas', 
        link: baseMenu + 'dictaminaciones-juridicas' 
      },
      {
        label: 'Actualización de Datos del Expediente', 
        link: baseMenu + 'actualizacion-datos-expediente'
      },
      {
        label: 'Actualización de Expedientes en Notificación', 
        link: baseMenu + 'actualizacion-expedientes-notificacion'
      },
      {
        label: 'Depositaría',
        subItems: [
          {
            label: 'Registro de Depositaría',
          },
        ],
      },
    ],
  }
  // PROCESOS JURIDICOS

// ]


export const routesJuridicalProcesses: any = 
// [
  {
    'dictaminaciones_juridicas': { label: 'Dictaminaciones Juridicas', link: 'dictaminaciones-juridicas', 
    import: './juridical-ruling/pj-dj-m-juridical-ruling.module', 
    componentName: 'PJDJJuridicalRulingComponent', routingName: 'PJDJJuridicalRulingRoutingModule', moduleName: 'PJDJJuridicalRulingModule'},
  // },
  // {
    'actualizacion_datos_expediente': { label: 'Actualización de Datos del Expediente', link: 'actualizacion-datos-expediente',
    import: './file-data-update/pj-ade-m-file-data-update.module', 
    componentName: 'PJADEFileDataUpdateComponent', routingName: 'PJADEFileDataUpdateRoutingModule', moduleName: 'PJADEFileDataUpdateModule'},
  // },
  // {
    'actualizacion_expedientes_notificacion': { label: 'Actualización de Expedientes en Notificación', link: 'actualizacion-expedientes-notificacion',
    import: './notification-file-update/pj-aen-m-notification-file-update.module', 
    componentName: 'PJAENNotificationFileUpdateComponent', routingName: 'PJAENNotificationFileUpdateRoutingModule', moduleName: 'PJAENNotificationFileUpdateModule'},
  }
// ]

export function generatorRoutesJuridicalProcesses() {
  let routes = [];
  for (const key in routesJuridicalProcesses) {
    if (routesJuridicalProcesses[key]) {
      const element = routesJuridicalProcesses[key];
      routes.push({
        path: element.link,
        loadChildren: async() => 
            (await import(element.import))[element.moduleName],
            data: { title: element.label }
      });
    }
  }
  return routes;
} 
// export function menuGenerator() {
//   let opcionesMenu: IMenuItem = {
//     label: 'Procesos Jurídicos',
//     icon: 'bx-share-alt',
//     subItems: [

//     ]
//   };
//   routesJuridicalProcesses.forEach((element: IMenuItem, index: number) => {
//     opcionesMenu.subItems.push({
//       id: (element.id) ? element.id : null,
//       label: (element.label) ? element.label : '',
//       icon: (element.icon) ? element.icon : '',
//       link: (element.link) ? element.link : '',
//       subItems: (element.subItems) ? element.subItems : [],
//       isTitle: (element.isTitle) ? element.isTitle : false,
//       badge: (element.badge) ? element.badge : '',
//       parentId: (element.parentId) ? element.parentId : null,
//       isLayout: (element.isLayout) ? element.isLayout : false,
//     })
//   });
//   return opcionesMenu;
// }