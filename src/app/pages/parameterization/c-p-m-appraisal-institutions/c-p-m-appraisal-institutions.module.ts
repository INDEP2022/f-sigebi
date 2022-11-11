import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMAppraisalInstitutionsModalComponent } from './c-p-m-appraisal-institutions-modal/c-p-m-appraisal-institutions-modal.component';
import { CPMAppraisalInstitutionsRoutingModule } from './c-p-m-appraisal-institutions-routing.module';
import { CPMAppraisalInstitutionsComponent } from './c-p-m-appraisal-institutions/c-p-m-appraisal-institutions.component';

@NgModule({
  declarations: [
    CPMAppraisalInstitutionsComponent,
    CPMAppraisalInstitutionsModalComponent,
  ],
  imports: [
    CommonModule,
    CPMAppraisalInstitutionsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMAppraisalInstitutionsModule {}
