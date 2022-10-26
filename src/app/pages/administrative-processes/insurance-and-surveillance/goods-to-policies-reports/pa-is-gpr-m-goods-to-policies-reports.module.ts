import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { PaIsGprMGoodsToPoliciesReportsRoutingModule } from './pa-is-gpr-m-goods-to-policies-reports-routing.module';
//@Standalone Components
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { PoliciesSharedComponent } from 'src/app/@standalone/shared-forms/policies-shared/policies-shared.component';
//Components
import { PaIsGprCReportComponent } from './report/pa-is-gpr-c-report.component';


@NgModule({
  declarations: [
    PaIsGprCReportComponent
  ],
  imports: [
    CommonModule,
    PaIsGprMGoodsToPoliciesReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    UsersSharedComponent,
    PoliciesSharedComponent
  ]
})
export class PaIsGprMGoodsToPoliciesReportsModule { }
