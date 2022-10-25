import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { RevisionReasonFormComponent } from './revision-reason-form/revision-reason-form.component';
import { RevisionReasonListComponent } from './revision-reason-list/revision-reason-list.component';
import { RevisionReasonRoutingModule } from './revision-reason-routing.module';

@NgModule({
  declarations: [RevisionReasonListComponent, RevisionReasonFormComponent],
  imports: [
    CommonModule,
    RevisionReasonRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RevisionReasonModule {}
