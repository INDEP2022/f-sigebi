import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MandateIncomeReportsIRoutingModule } from './mandate-income-reports-i-routing.module';
import { MandateIncomeReportsIComponent } from './mandate-income-reports-i/mandate-income-reports-i.component';

@NgModule({
  declarations: [MandateIncomeReportsIComponent],
  imports: [
    CommonModule,
    MandateIncomeReportsIRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    UsersSharedComponent,
    EventsSharedComponent,
  ],
})
export class MandateIncomeReportsIModule {}
