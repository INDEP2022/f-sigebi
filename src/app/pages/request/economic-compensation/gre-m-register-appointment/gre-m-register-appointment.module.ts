import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { GreCRegisterAppointmentMainComponent } from './gre-c-register-appointment-main/gre-c-register-appointment-main.component';
import { GreMRegisterAppointmentRoutingModule } from './gre-m-register-appointment-routing.module';

@NgModule({
  declarations: [GreCRegisterAppointmentMainComponent],
  imports: [
    CommonModule,
    GreMRegisterAppointmentRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class GreMRegisterAppointmentModule {}
