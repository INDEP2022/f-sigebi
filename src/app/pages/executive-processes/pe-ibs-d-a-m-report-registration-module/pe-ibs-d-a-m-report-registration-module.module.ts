import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeIbsDACReportRegistrationModuleComponent } from './pe-ibs-d-a-c-report-registration-module/pe-ibs-d-a-c-report-registration-module.component';
import { PeIbsDAMReportRegistrationModuleRoutingModule } from './pe-ibs-d-a-m-report-registration-module-routing.module';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@NgModule({
  declarations: [PeIbsDACReportRegistrationModuleComponent],
  imports: [
    CommonModule,
    PeIbsDAMReportRegistrationModuleRoutingModule,
    BsDatepickerModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
  ],
})
export class PeIbsDAMReportRegistrationModuleModule {}
