/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { AppointmentsRoutingModule } from './appointments-routing.module';

/** COMPONENTS IMPORTS */
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppointmentsRelationsPaysComponent } from './appointments-relations-pays/appointments-relations-pays.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ScanningFoilAppointmentComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [
    AppointmentsComponent,
    ScanningFoilAppointmentComponent,
    AppointmentsRelationsPaysComponent,
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
  ],
})
export class AppointmentsModule {}
