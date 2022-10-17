import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';

import { PeIbsDAMReportRegistrationModuleRoutingModule } from './pe-ibs-d-a-m-report-registration-module-routing.module';
import { PeIbsDACReportRegistrationModuleComponent } from './pe-ibs-d-a-c-report-registration-module/pe-ibs-d-a-c-report-registration-module.component';

@NgModule({
  declarations: [PeIbsDACReportRegistrationModuleComponent],
  imports: [
    CommonModule,
    PeIbsDAMReportRegistrationModuleRoutingModule,
    BsDatepickerModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
  ],
})
export class PeIbsDAMReportRegistrationModuleModule {}
