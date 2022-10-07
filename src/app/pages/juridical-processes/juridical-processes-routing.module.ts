/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { routesJuridicalProcesses } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */



const routes: Routes = [
    {
        path: routesJuridicalProcesses.dictaminaciones_juridicas.link,
        loadChildren: async() => 
            (await import('./juridical-ruling/pj-dj-m-juridical-ruling.module'))
                .PJDJJuridicalRulingModule,
            data: { title: routesJuridicalProcesses.dictaminaciones_juridicas.label }
    },
    {
        path: routesJuridicalProcesses.actualizacion_datos_expediente.link,
        loadChildren: async() => 
            (await import('./file-data-update/pj-ade-m-file-data-update.module'))
                .PJADEFileDataUpdateModule,
            data: { title: routesJuridicalProcesses.actualizacion_datos_expediente.label }
    },
    {
        path: routesJuridicalProcesses.actualizacion_expedientes_notificacion.link,
        loadChildren: async() => 
            (await import('./notification-file-update/pj-aen-m-notification-file-update.module'))
                .PJAENNotificationFileUpdateModule,
                data: { title: routesJuridicalProcesses.actualizacion_expedientes_notificacion.label }
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class JuridicalProcessesRoutingModule { }