import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { ClarificationsDetailComponent } from './clarifications-detail/clarifications-detail.component';
import { ClarificationsListComponent } from './clarifications-list/clarifications-list.component';
import { ClarificationsRoutingModule } from './clarifications-routing.module';

@NgModule({
  declarations: [ClarificationsListComponent, ClarificationsDetailComponent],
  imports: [
    CommonModule,
    ClarificationsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class ClarificationsModule {}
