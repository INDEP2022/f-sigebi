import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDocumentsForReviewComponent } from './report-documents-for-review/report-documents-for-review.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDocumentsForReviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportDocumentsForReviewRoutingModule {}
