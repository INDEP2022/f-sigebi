import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeRddgTddrMReportDocReceivedRoutingModule } from './pe-rddg-tddr-m-report-doc-received-routing.module';
import { PeRddgTddrCReportDocReceivedComponent } from './pe-rddg-tddr-c-report-doc-received/pe-rddg-tddr-c-report-doc-received.component';


@NgModule({
  declarations: [
    PeRddgTddrCReportDocReceivedComponent
  ],
  imports: [
    CommonModule,
    PeRddgTddrMReportDocReceivedRoutingModule
  ]
})
export class PeRddgTddrMReportDocReceivedModule { }
