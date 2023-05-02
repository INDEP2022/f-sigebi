import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { ApprovalChangeNumeraireRoutingModule } from './approval-change-numeraire-routing.module';
import { ApprovalChangeNumeraireComponent } from './approval-change-numeraire/approval-change-numeraire.component';

@NgModule({
  declarations: [ApprovalChangeNumeraireComponent],
  imports: [
    CommonModule,
    ApprovalChangeNumeraireRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class ApprovalChangeNumeraireModule {}
