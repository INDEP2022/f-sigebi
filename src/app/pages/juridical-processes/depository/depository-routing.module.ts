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
    },
    {
        path: routesJuridicalProcesses[5].link,
        loadChildren: async() => 
            (await import('./conciliation-depositary-payments/pj-d-pdp-m-conciliation-depositary-payments.module'))
                .PJDPDPConciliationDepositaryPaymentsModule,
                data: { title: routesJuridicalProcesses[5].label }
    },
    {
        path: routesJuridicalProcesses[6].link,
        loadChildren: async() => 
            (await import('./conciliation-depositary-payments/pj-d-pdp-m-conciliation-depositary-payments.module'))
                .PJDPDPConciliationDepositaryPaymentsModule,
                data: { title: routesJuridicalProcesses[6].label }
    }
    // DEPOSITARIA
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DepositoryRoutingModule { }