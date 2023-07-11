import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DateInitialFinishComponent } from 'src/app/@standalone/shared-forms/date-initial-finish/date-initial-finish.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimsFollowUpDetailComponent } from './claims-follow-up-detail/claims-follow-up-detail.component';
import { ClaimsFollowUpRoutingModule } from './claims-follow-up-routing.module';
import { ClaimsFollowUpComponent } from './claims-follow-up/claims-follow-up.component';

@NgModule({
  declarations: [ClaimsFollowUpComponent, ClaimsFollowUpDetailComponent],
  imports: [
    CommonModule,
    ClaimsFollowUpRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    DateInitialFinishComponent,
  ],
})
export class ClaimsFollowUpModule {}
