import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { MnceAdmDepositoryAuditorModalComponent } from './mnce-adm-depository-auditor-modal/mnce-adm-depository-auditor-modal.component';
import { MnceAdmDepositoryAuditorRoutingModule } from './mnce-adm-depository-auditor-routing.module';
import { MnceAdmDepositoryAuditorComponent } from './mnce-adm-depository-auditor/mnce-adm-depository-auditor.component';

@NgModule({
  declarations: [
    MnceAdmDepositoryAuditorComponent,
    MnceAdmDepositoryAuditorModalComponent,
  ],
  imports: [
    CommonModule,
    MnceAdmDepositoryAuditorRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MnceAdmDepositoryAuditorModule {}
