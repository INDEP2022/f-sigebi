import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeGdaddCApprovalChangeNumeraireComponent } from './pe-gdadd-c-approval-change-numeraire/pe-gdadd-c-approval-change-numeraire.component';
import { PeGdaddMApprovalChangeNumeraireRoutingModule } from './pe-gdadd-m-approval-change-numeraire-routing.module';

@NgModule({
  declarations: [PeGdaddCApprovalChangeNumeraireComponent],
  imports: [
    CommonModule,
    PeGdaddMApprovalChangeNumeraireRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class PeGdaddMApprovalChangeNumeraireModule {}
