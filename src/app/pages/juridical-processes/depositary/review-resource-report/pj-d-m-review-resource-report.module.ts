/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDReviewResourceReportRoutingModule } from './pj-d-m-review-resource-report-routing.module';

/** COMPONENTS IMPORTS */
import { PJDReviewResourceReportComponent } from './review-resource-report/pj-d-c-review-resource-report.component';

@NgModule({
  declarations: [PJDReviewResourceReportComponent],
  imports: [CommonModule, PJDReviewResourceReportRoutingModule, SharedModule],
})
export class PJDReviewResourceReportModule {}
