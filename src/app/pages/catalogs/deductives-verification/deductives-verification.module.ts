import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeductivesVerificationRoutingModule } from './deductives-verification-routing.module';
import { DeductivesVerificationListComponent } from './deductives-verification-list/deductives-verification-list.component';
import { DeductivesVerificationFormComponent } from './deductives-verification-form/deductives-verification-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';

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
  providers: [DeductiveVerificationService],
})
export class DeductivesVerificationModule {}
