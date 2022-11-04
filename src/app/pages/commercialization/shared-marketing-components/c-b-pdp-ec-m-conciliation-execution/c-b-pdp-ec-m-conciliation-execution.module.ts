import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CBPdpEcCConciliationExecutionMainComponent } from './c-b-pdp-ec-c-conciliation-execution-main/c-b-pdp-ec-c-conciliation-execution-main.component';
import { CBPdpEcMConciliationExecutionRoutingModule } from './c-b-pdp-ec-m-conciliation-execution-routing.module';

@NgModule({
  declarations: [CBPdpEcCConciliationExecutionMainComponent],
  imports: [
    CommonModule,
    CBPdpEcMConciliationExecutionRoutingModule,
    SharedModule,
    NgScrollbarModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
  ],
})
export class CBPdpEcMConciliationExecutionModule {}
