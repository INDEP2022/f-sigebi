/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDRDAppointmentsComponent } from './appointments/pj-d-rd-c-appointments.component';



const routes: Routes = [
    {
        path: '',
        component: PJDRDAppointmentsComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PJDRDAppointmentsRoutingModule { }