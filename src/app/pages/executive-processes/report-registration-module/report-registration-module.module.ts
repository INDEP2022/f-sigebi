import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportRegistrationModuleRoutingModule } from './report-registration-module-routing.module';
import { ReportRegistrationModuleComponent } from './report-registration-module/report-registration-module.component';

@NgModule({
  declarations: [ReportRegistrationModuleComponent],
  imports: [
    CommonModule,
    ReportRegistrationModuleRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class ReportRegistrationModuleModule {}
