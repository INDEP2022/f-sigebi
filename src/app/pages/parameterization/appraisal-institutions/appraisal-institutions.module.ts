import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppraisalInstitutionsModalComponent } from './appraisal-institutions-modal/appraisal-institutions-modal.component';
import { AppraisalInstitutionsRoutingModule } from './appraisal-institutions-routing.module';
import { AppraisalInstitutionsComponent } from './appraisal-institutions/appraisal-institutions.component';

@NgModule({
  declarations: [
    AppraisalInstitutionsComponent,
    AppraisalInstitutionsModalComponent,
  ],
  imports: [
    CommonModule,
    AppraisalInstitutionsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class AppraisalInstitutionsModule {}
