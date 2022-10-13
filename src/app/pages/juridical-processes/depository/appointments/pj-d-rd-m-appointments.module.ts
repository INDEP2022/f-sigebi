/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDRDAppointmentsRoutingModule } from './pj-d-rd-m-appointments-routing.module';

/** COMPONENTS IMPORTS */
import { PJDRDAppointmentsComponent } from './appointments/pj-d-rd-c-appointments.component';

@NgModule({
  declarations: [PJDRDAppointmentsComponent],
  imports: [CommonModule, PJDRDAppointmentsRoutingModule, SharedModule],
})
export class PJDRDAppointmentsModule {}
