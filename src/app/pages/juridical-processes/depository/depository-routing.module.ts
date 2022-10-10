/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { routesJuridicalProcesses } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */



const routes: Routes = [
    // DEPOSITARIA
    {
        path: routesJuridicalProcesses[4].link,
        loadChildren: async() => 
            (await import('./appointments/pj-d-rd-m-appointments.module'))
                .PJDRDAppointmentsModule,
                data: { title: routesJuridicalProcesses[4].label }
    }
    // DEPOSITARIA
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DepositoryRoutingModule { }