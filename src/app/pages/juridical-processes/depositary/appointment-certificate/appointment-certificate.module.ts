/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { AppointmentCertificateRoutingModule } from './appointment-certificate-routing.module';

/** COMPONENTS IMPORTS */
import { AppointmentCertificateComponent } from './appointment-certificate/appointment-certificate.component';

@NgModule({
  declarations: [AppointmentCertificateComponent],
  imports: [CommonModule, AppointmentCertificateRoutingModule, SharedModule],
})
export class AppointmentCertificateModule {}
