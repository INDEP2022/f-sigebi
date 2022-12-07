import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpTreeReportRoutingModule } from './gp-tree-report-routing.module';
import { GpTreeReportComponent } from './gp-tree-report/gp-tree-report.component';

@NgModule({
  declarations: [GpTreeReportComponent],
  imports: [CommonModule, GpTreeReportRoutingModule, SharedModule, TabsModule],
})
export class GpTreeReportModule {}
