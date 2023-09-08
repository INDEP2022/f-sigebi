import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultReportRoutingModule } from './consult-report-routing.module';
import { ReportConsolidatedEntryOrderComponent } from './report-consolidated-entry-order/report-consolidated-entry-order.component';
import { ReportExpensesForGoodComponent } from './report-expenses-for-good/report-expenses-for-good.component';

@NgModule({
  declarations: [
    ReportExpensesForGoodComponent,
    ReportConsolidatedEntryOrderComponent,
  ],
  imports: [CommonModule, ConsultReportRoutingModule, TabsModule, SharedModule],
})
export class ConsultReportModule {}
