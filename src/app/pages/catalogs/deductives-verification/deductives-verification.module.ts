import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeductivesVerificationFormComponent } from './deductives-verification-form/deductives-verification-form.component';
import { DeductivesVerificationListComponent } from './deductives-verification-list/deductives-verification-list.component';
import { DeductivesVerificationRoutingModule } from './deductives-verification-routing.module';

@NgModule({
  declarations: [
    DeductivesVerificationListComponent,
    DeductivesVerificationFormComponent,
  ],
  imports: [
    CommonModule,
    DeductivesVerificationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DeductivesVerificationModule {}
