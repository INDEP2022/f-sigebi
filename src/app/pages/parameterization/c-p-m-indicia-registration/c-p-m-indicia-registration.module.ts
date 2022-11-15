import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPIrCIndiciaRegistrationComponent } from './c-p-ir-c-indicia-registration/c-p-ir-c-indicia-registration.component';
import { CPMIndiciaRegistrationRoutingModule } from './c-p-m-indicia-registration-routing.module';
import { ModalIndiciaRegistrationComponent } from './modal-indicia-registration/modal-indicia-registration.component';

@NgModule({
  declarations: [
    CPIrCIndiciaRegistrationComponent,
    ModalIndiciaRegistrationComponent,
  ],
  imports: [
    CommonModule,
    CPMIndiciaRegistrationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMIndiciaRegistrationModule {}
