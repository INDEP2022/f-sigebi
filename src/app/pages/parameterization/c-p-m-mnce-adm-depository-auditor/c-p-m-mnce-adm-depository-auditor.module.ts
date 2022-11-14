import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCMnceAdmDepositoryAuditorModalComponent } from './c-p-c-mnce-adm-depository-auditor-modal/c-p-c-mnce-adm-depository-auditor-modal.component';
import { CPCMnceAdmDepositoryAuditorComponent } from './c-p-c-mnce-adm-depository-auditor/c-p-c-mnce-adm-depository-auditor.component';
import { CPMMnceAdmDepositoryAuditorRoutingModule } from './c-p-m-mnce-adm-depository-auditor-routing.module';

@NgModule({
  declarations: [
    CPCMnceAdmDepositoryAuditorComponent,
    CPCMnceAdmDepositoryAuditorModalComponent,
  ],
  imports: [
    CommonModule,
    CPMMnceAdmDepositoryAuditorRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMMnceAdmDepositoryAuditorModule {}
