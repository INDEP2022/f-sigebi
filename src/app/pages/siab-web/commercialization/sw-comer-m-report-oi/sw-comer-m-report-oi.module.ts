import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCReportOiComponent } from './sw-comer-c-report-oi/sw-comer-c-report-oi.component';
import { SwComerMReportOiRoutingModule } from './sw-comer-m-report-oi-routing.module';

@NgModule({
  declarations: [SwComerCReportOiComponent],
  imports: [
    CommonModule,
    SwComerMReportOiRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SwComerMReportOiModule {}
