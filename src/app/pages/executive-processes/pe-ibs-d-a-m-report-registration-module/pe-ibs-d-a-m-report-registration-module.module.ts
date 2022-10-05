import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeIbsDAMReportRegistrationModuleRoutingModule } from './pe-ibs-d-a-m-report-registration-module-routing.module';
import { PeIbsDACReportRegistrationModuleComponent } from './pe-ibs-d-a-c-report-registration-module/pe-ibs-d-a-c-report-registration-module.component';


@NgModule({
  declarations: [
    PeIbsDACReportRegistrationModuleComponent
  ],
  imports: [
    CommonModule,
    PeIbsDAMReportRegistrationModuleRoutingModule,
    BsDatepickerModule,
    SharedModule
  ]
})
export class PeIbsDAMReportRegistrationModuleModule { }
