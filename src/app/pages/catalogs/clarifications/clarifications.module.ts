import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClarificationsRoutingModule } from './clarifications-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClarificationsListComponent } from './clarifications-list/clarifications-list.component';
import { ClarificationsDetailComponent } from './clarifications-detail/clarifications-detail.component';

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
