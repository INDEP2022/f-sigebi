import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDRdrReportDocumentsForReviewComponent } from './jp-d-rdr-report-documents-for-review/jp-d-rdr-report-documents-for-review.component';

const routes: Routes = [
  {
    path: '',
    component: JpDRdrReportDocumentsForReviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMReportDocumentsForReviewRoutingModule {}
