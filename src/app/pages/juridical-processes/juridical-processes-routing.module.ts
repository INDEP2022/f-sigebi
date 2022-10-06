/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { rutasJuridicalProcesses } from './juridical-processes-nombres-rutas-archivos';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */



const routes: Routes = [
    {
        path: rutasJuridicalProcesses._1.ruta,
        loadChildren: async() => 
            (await import('./juridical-ruling/pj-dj-m-juridical-ruling.module'))
                .PJDJJuridicalRulingModule,
            data: { title: rutasJuridicalProcesses._1.titulo }
    },
    {
        path: rutasJuridicalProcesses._2.ruta,
        loadChildren: async() => 
            (await import('./file-data-update/pj-ade-m-file-data-update.module'))
                .PJADEFileDataUpdateModule,
            data: { title: rutasJuridicalProcesses._2.titulo }
    },
    {
        path: rutasJuridicalProcesses._3.ruta,
        loadChildren: async() => 
            (await import('./notification-file-update/pj-aen-m-notification-file-update.module'))
                .PJAENNotificationFileUpdateModule,
                data: { title: rutasJuridicalProcesses._3.titulo }
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class JuridicalProcessesRoutingModule { }