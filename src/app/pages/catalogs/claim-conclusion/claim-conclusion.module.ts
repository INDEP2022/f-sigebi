import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimConclusionFormComponent } from './claim-conclusion-form/claim-conclusion-form.component';
import { ClaimConclusionListComponent } from './claim-conclusion-list/claim-conclusion-list.component';
import { ClaimConclusionRoutingModule } from './claim-conclusion-routing.module';

@NgModule({
  declarations: [ClaimConclusionFormComponent, ClaimConclusionListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ClaimConclusionRoutingModule,
  ],
})
export class ClaimConclusionModule {}
