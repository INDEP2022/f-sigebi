import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { TreeReportRoutingModule } from './tree-report-routing.module';
import { TreeReportComponent } from './tree-report/tree-report.component';

@NgModule({
  declarations: [TreeReportComponent],
  imports: [CommonModule, TreeReportRoutingModule, SharedModule, TabsModule],
})
export class TreeReportModule {}
