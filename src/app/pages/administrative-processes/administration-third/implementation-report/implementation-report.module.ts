import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImplementationReportRoutingModule } from './implementation-report-routing.module';
import { ImplementationReportComponent } from './implementation-report/implementation-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImplementationReportHistoricComponent } from './implementation-report-historic/implementation-report-historic.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    ImplementationReportComponent,
    ImplementationReportHistoricComponent
  ],
  exports: [ImplementationReportHistoricComponent],
  imports: [
    CommonModule,
    ImplementationReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class ImplementationReportModule { }
