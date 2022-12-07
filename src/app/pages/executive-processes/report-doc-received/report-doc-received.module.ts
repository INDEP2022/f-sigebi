import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportDocReceivedRoutingModule } from './report-doc-received-routing.module';
import { ReportDocReceivedComponent } from './report-doc-received/report-doc-received.component';

@NgModule({
  declarations: [ReportDocReceivedComponent],
  imports: [
    CommonModule,
    ReportDocReceivedRoutingModule,
    SharedModule,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class ReportDocReceivedModule {}
