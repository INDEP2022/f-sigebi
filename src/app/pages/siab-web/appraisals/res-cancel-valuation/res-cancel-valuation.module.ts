import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelReportComponent } from 'src/app/@standalone/excel-report/excel-report.component';
import { resCancelValuationRoutingModule } from './res-cancel-valuation-routing.module';
import { CancelTableComponent } from './res-cancel-valuation/cancel-table/cancel-table.component';
import { resCancelValuationComponent } from './res-cancel-valuation/res-cancel-valuation.component';
import { ValuedTableComponent } from './res-cancel-valuation/valued-table/valued-table.component';

@NgModule({
  declarations: [
    resCancelValuationComponent,
    CancelTableComponent,
    ValuedTableComponent,
  ],
  imports: [
    CommonModule,
    resCancelValuationRoutingModule,
    SharedModule,
    ExcelReportComponent,
  ],
})
export class resCancelValuationModule {}
