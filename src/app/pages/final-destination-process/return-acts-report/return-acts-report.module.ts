import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { ReturnActsReportRoutingModule } from './return-acts-report-routing.module';
import { ReturnActsReportComponent } from './return-acts-report/return-acts-report.component';

@NgModule({
  declarations: [ReturnActsReportComponent],
  imports: [
    CommonModule,
    ReturnActsReportRoutingModule,
    SharedModule,
    FormsModule,
    SharedFinalDestinationModule,
  ],
})
export class ReturnActsReportModule {}
