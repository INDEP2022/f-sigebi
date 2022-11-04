import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PeRddgTddrCReportDocReceivedComponent } from './pe-rddg-tddr-c-report-doc-received/pe-rddg-tddr-c-report-doc-received.component';
import { PeRddgTddrMReportDocReceivedRoutingModule } from './pe-rddg-tddr-m-report-doc-received-routing.module';

@NgModule({
  declarations: [PeRddgTddrCReportDocReceivedComponent],
  imports: [
    CommonModule,
    PeRddgTddrMReportDocReceivedRoutingModule,
    SharedModule,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeRddgTddrMReportDocReceivedModule {}
