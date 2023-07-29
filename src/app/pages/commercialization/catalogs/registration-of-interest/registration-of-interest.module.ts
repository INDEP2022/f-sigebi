import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterDatePickerComponent } from './filter-date-picker/filter-date-picker.component';
import { RegistrationOfInterestModalComponent } from './registration-of-interest-modal/registration-of-interest-modal.component';
import { RegistrationOfInterestRoutingModule } from './registration-of-interest-routing.module';
import { RegistrationOfInterestComponent } from './registration-of-interest.component';

@NgModule({
  declarations: [
    RegistrationOfInterestComponent,
    RegistrationOfInterestModalComponent,
    FilterDatePickerComponent,
  ],
  imports: [
    CommonModule,
    RegistrationOfInterestRoutingModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forChild(),
  ],
})
export class RegistrationOfInterestModule {}
