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
import { NgxCurrencyModule } from 'ngx-currency';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { AppointmentsAdministrativeReportComponent } from './appointments-administrative-report/appointments-administrative-report.component';
import { AppointmentsJuridicalReportComponent } from './appointments-juridical-report/appointments-juridical-report.component';
import { AppointmentsRelationsPaysComponent } from './appointments-relations-pays/appointments-relations-pays.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { EmailAppointmentComponent } from './email/email.component';
import { ListDataAppointmentGoodsComponent } from './list-data-good/list-data-good.component';
import { ListDataAppointmentComponent } from './list-data/list-data.component';
import { ModalScanningFoilAppointmentTableComponent } from './modal-scanning-foil/modal-scanning-foil.component';
import { PersonFormComponentAppointment } from './person-form/person-form-appointment.component';
import { ScanningFoilAppointmentComponent } from './scanning-foil/scanning-foil.component';

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '$',
  suffix: '',
  thousands: ',',
  nullable: false,
};

@NgModule({
  declarations: [
    AppointmentsComponent,
    ScanningFoilAppointmentComponent,
    AppointmentsRelationsPaysComponent,
    AppointmentsJuridicalReportComponent,
    AppointmentsAdministrativeReportComponent,
    ModalScanningFoilAppointmentTableComponent,
    PersonFormComponentAppointment,
    ListDataAppointmentComponent,
    ListDataAppointmentGoodsComponent,
    EmailAppointmentComponent,
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
    FormLoaderComponent,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class AppointmentsModule {}
