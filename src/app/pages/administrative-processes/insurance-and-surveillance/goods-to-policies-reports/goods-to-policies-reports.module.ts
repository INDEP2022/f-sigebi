import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { GoodsToPoliciesReportsRoutingModule } from './goods-to-policies-reports-routing.module';
//@Standalone Components
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { PoliciesSharedComponent } from 'src/app/@standalone/shared-forms/policies-shared/policies-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
//Components
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    GoodsToPoliciesReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    UsersSharedComponent,
    PoliciesSharedComponent,
  ],
})
export class GoodsToPoliciesReportsModule {}
