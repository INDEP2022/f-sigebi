import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDMReportDocumentsForReviewRoutingModule } from './jp-d-m-report-documents-for-review-routing.module';
import { JpDRdrReportDocumentsForReviewComponent } from './jp-d-rdr-report-documents-for-review/jp-d-rdr-report-documents-for-review.component';

@NgModule({
  declarations: [JpDRdrReportDocumentsForReviewComponent],
  imports: [
    CommonModule,
    JpDMReportDocumentsForReviewRoutingModule,
    SharedModule,
  ],
})
export class JpDMReportDocumentsForReviewModule {}
