import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeductivesVerificationRoutingModule } from './deductives-verification-routing.module';
import { DeductivesVerificationListComponent } from './deductives-verification-list/deductives-verification-list.component';
import { DeductivesVerificationFormComponent } from './deductives-verification-form/deductives-verification-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
