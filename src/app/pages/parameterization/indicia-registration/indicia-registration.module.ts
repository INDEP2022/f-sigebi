import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndiciaRegistrationRoutingModule } from './indicia-registration-routing.module';
import { IndiciaRegistrationComponent } from './indicia-registration/indicia-registration.component';
import { ModalIndiciaRegistrationComponent } from './modal-indicia-registration/modal-indicia-registration.component';

@NgModule({
  declarations: [
    IndiciaRegistrationComponent,
    ModalIndiciaRegistrationComponent,
  ],
  imports: [
    CommonModule,
    IndiciaRegistrationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class IndiciaRegistrationModule {}
