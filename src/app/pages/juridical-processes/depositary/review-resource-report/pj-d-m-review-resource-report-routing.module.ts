/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDReviewResourceReportComponent } from './review-resource-report/pj-d-c-review-resource-report.component';

const routes: Routes = [
  {
    path: '',
    component: PJDReviewResourceReportComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDReviewResourceReportRoutingModule {}
