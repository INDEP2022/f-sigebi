import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { RevisionReasonRoutingModule } from './revision-reason-routing.module';
import { RevisionReasonListComponent } from './revision-reason-list/revision-reason-list.component';
import { RevisionReasonFormComponent } from './revision-reason-form/revision-reason-form.component';

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
