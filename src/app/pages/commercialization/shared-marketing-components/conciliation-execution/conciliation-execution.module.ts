import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConciliationExecutionMainComponent } from './conciliation-execution-main/conciliation-execution-main.component';
import { ConciliationExecutionRoutingModule } from './conciliation-execution-routing.module';

@NgModule({
  declarations: [ConciliationExecutionMainComponent],
  imports: [
    CommonModule,
    ConciliationExecutionRoutingModule,
    SharedModule,
    NgScrollbarModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
  ],
})
export class ConciliationExecutionModule {}
