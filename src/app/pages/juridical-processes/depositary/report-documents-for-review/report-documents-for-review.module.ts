import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReportDocumentsForReviewRoutingModule } from './report-documents-for-review-routing.module';
import { ReportDocumentsForReviewComponent } from './report-documents-for-review/report-documents-for-review.component';

@NgModule({
  declarations: [ReportDocumentsForReviewComponent],
  imports: [CommonModule, ReportDocumentsForReviewRoutingModule, SharedModule],
})
export class ReportDocumentsForReviewModule {}
