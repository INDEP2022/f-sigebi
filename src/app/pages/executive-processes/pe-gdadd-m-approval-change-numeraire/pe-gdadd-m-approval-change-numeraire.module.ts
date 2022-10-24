import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PeGdaddMApprovalChangeNumeraireRoutingModule } from './pe-gdadd-m-approval-change-numeraire-routing.module';
import { PeGdaddCApprovalChangeNumeraireComponent } from './pe-gdadd-c-approval-change-numeraire/pe-gdadd-c-approval-change-numeraire.component';


@NgModule({
  declarations: [
    PeGdaddCApprovalChangeNumeraireComponent
  ],
  imports: [
    CommonModule,
    PeGdaddMApprovalChangeNumeraireRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class PeGdaddMApprovalChangeNumeraireModule { }
