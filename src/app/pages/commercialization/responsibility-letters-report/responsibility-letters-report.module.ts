import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DepartmentsSharedComponent } from 'src/app/@standalone/shared-forms/departments-shared/departments-shared.component';
import { FederativeSharedComponent } from 'src/app/@standalone/shared-forms/federative-shared/federative-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResponsibilityLettersReportRoutingModule } from './responsibility-letters-report-routing.module';
import { ResponsibilityLettersReportComponent } from './responsibility-letters-report.component';

@NgModule({
  declarations: [ResponsibilityLettersReportComponent],
  imports: [
    CommonModule,
    ResponsibilityLettersReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    DelegationSharedComponent,
    FederativeSharedComponent,
    DepartmentsSharedComponent,
  ],
})
export class ResponsibilityLettersReportModule {}
