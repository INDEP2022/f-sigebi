import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request.module';
import { RegisterRequestRoutingModule } from './register-request-routing.module';
import { RegisterRequestComponent } from './register-request.component';

@NgModule({
  declarations: [RegisterRequestComponent],
  imports: [
    CommonModule,
    RegisterRequestRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class RegisterRequestModule {}
