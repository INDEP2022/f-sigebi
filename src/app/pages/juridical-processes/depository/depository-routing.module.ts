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
        path: routesJuridicalProcesses[7].link,
        loadChildren: async() => 
            (await import('./request-legal-destination-goods/pj-d-s-md-m-request-legal-destination-goods.module'))
                .PJDSMDRequestLegalDestinationGoodsModule,
                data: { title: routesJuridicalProcesses[7].label }
    },
    {
        path: routesJuridicalProcesses[8].link,
        loadChildren: async() => 
            (await import('./appointment-certificate/pj-d-rcn-m-appointment-certificate.module'))
                .PJDRCNAppointmentCertificateModule,
                data: { title: routesJuridicalProcesses[8].label }
    },
    // DEPOSITARIA
    
    // PROCESO DE DISPERCION DE PAGOS
    {
        path: 'procesos-dispercion-pagos',
        loadChildren: async() => 
            (await import('./payment-dispersal-process/payment-dispersal-process.module'))
                .PaymentDispersalProcessModule,
                data: { title: "Proceso de Disperción de Pagos" }
    }
    // PROCESO DE DISPERCION DE PAGOS
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DepositoryRoutingModule { }