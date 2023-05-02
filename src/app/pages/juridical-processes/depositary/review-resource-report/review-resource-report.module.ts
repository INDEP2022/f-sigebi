/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ReviewResourceReportRoutingModule } from './review-resource-report-routing.module';

/** COMPONENTS IMPORTS */
import { ReviewResourceReportComponent } from './review-resource-report/review-resource-report.component';

@NgModule({
  declarations: [ReviewResourceReportComponent],
  imports: [CommonModule, ReviewResourceReportRoutingModule, SharedModule],
})
export class ReviewResourceReportModule {}
