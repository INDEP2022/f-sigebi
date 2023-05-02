import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { winnersReportRoutingModule } from './winners-report-routing.module';
import { winnersReportComponent } from './winners-report/winners-report.component';

@NgModule({
  declarations: [winnersReportComponent],
  imports: [
    CommonModule,
    winnersReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class winnersReportModule {}
