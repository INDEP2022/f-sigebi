import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewDocumentsComponent } from '../../../@standalone/preview-documents/preview-documents.component';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    PreviewDocumentsComponent,
  ],
})
export class ReportModule {}
