import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCMRegistrationOfInterestRoutingModule } from './c-c-m-registration-of-interest-routing.module';
import { CCMRegistrationOfInterestComponent } from './c-c-m-registration-of-interest.component';
import { RegistrationOfInterestModalComponent } from './registration-of-interest-modal/registration-of-interest-modal.component';

@NgModule({
  declarations: [
    CCMRegistrationOfInterestComponent,
    RegistrationOfInterestModalComponent,
  ],
  imports: [
    CommonModule,
    CCMRegistrationOfInterestRoutingModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forChild(),
  ],
})
export class CCMRegistrationOfInterestModule {}
