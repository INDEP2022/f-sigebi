import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { RegisterAppointmentMainComponent } from './register-appointment-main/register-appointment-main.component';
import { RegisterAppointmentRoutingModule } from './register-appointment-routing.module';

@NgModule({
  declarations: [RegisterAppointmentMainComponent],
  imports: [
    CommonModule,
    RegisterAppointmentRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class RegisterAppointmentModule {}
