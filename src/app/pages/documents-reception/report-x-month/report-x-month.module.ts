import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DepartmentsSharedComponent } from 'src/app/@standalone/shared-forms/departments-shared/departments-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportXMonthRoutingModule } from './report-x-month-routing.module';
import { ReportXMonthComponent } from './report-x-month/report-x-month.component';

@NgModule({
  declarations: [ReportXMonthComponent],
  imports: [
    CommonModule,
    ReportXMonthRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DepartmentsSharedComponent,
  ],
})
export class ReportXMonthModule {}
