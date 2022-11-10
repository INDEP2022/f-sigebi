import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
//Routing
import { CBMirMMandateIncomeReportsRoutingModule } from './c-b-mir-m-mandate-income-reports-routing.module';
//Components
import { CBMirCMandateIncomeReportsComponent } from './mandate-income-reports/c-b-mir-c-mandate-income-reports.component';

@NgModule({
  declarations: [CBMirCMandateIncomeReportsComponent],
  imports: [
    CommonModule,
    CBMirMMandateIncomeReportsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    UsersSharedComponent,
    EventsSharedComponent,
  ],
})
export class CBMirMMandateIncomeReportsModule {}
