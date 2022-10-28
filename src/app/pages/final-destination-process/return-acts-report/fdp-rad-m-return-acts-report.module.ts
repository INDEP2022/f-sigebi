import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedFinalDestinationModule } from '../shared-final-destination/shared-final-destination.module';
import { FdpRadMReturnActsReportRoutingModule } from './fdp-rad-m-return-acts-report-routing.module';
import { FdpRadCReturnActsReportComponent } from './return-acts-report/fdp-rad-c-return-acts-report.component';

@NgModule({
  declarations: [FdpRadCReturnActsReportComponent],
  imports: [
    CommonModule,
    FdpRadMReturnActsReportRoutingModule,
    SharedModule,
    FormsModule,
    SharedFinalDestinationModule,
  ],
})
export class FdpRadMReturnActsReportModule {}
