/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDRCNAppointmentCertificateComponent } from './appointment-certificate/pj-d-rcn-c-appointment-certificate.component';



const routes: Routes = [
    {
        path: '',
        component: PJDRCNAppointmentCertificateComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PJDRCNAppointmentCertificateRoutingModule { }