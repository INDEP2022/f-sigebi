/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDRCNAppointmentCertificateRoutingModule } from './pj-d-rcn-m-appointment-certificate-routing.module';

/** COMPONENTS IMPORTS */
import { PJDRCNAppointmentCertificateComponent } from './appointment-certificate/pj-d-rcn-c-appointment-certificate.component';

@NgModule({
  declarations: [
    PJDRCNAppointmentCertificateComponent
  ],
  imports: [
    CommonModule,
    PJDRCNAppointmentCertificateRoutingModule,
    SharedModule,
  ],
})
export class PJDRCNAppointmentCertificateModule {}
