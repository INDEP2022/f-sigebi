import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { DictumInformationTabComponent } from './components/dictum-information-tab/dictum-information-tab.component';
import { RegisterAppointmentTabComponent } from './components/register-appointment-tab/register-appointment-tab.component';
import { EconomicCompensationRoutingModule } from './economic-compensation-routing.module';

@NgModule({
  declarations: [
    DictumInformationTabComponent,
    RegisterAppointmentTabComponent,
  ],
  imports: [
    CommonModule,
    EconomicCompensationRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [DictumInformationTabComponent, RegisterAppointmentTabComponent],
})
export class EconomicCompensationModule {}
