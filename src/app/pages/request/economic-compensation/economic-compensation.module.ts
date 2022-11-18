import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { DictumInformationTabComponent } from './components/dictum-information-tab/dictum-information-tab.component';
import { EntryOrderViewComponent } from './components/entry-order-view/entry-order-view.component';
import { EntryOrderComponent } from './components/entry-order/entry-order.component';
import { RegisterAppointmentTabComponent } from './components/register-appointment-tab/register-appointment-tab.component';
import { EconomicCompensationRoutingModule } from './economic-compensation-routing.module';

@NgModule({
  declarations: [
    DictumInformationTabComponent,
    RegisterAppointmentTabComponent,
    EntryOrderComponent,
    EntryOrderViewComponent,
  ],
  imports: [
    CommonModule,
    EconomicCompensationRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DictumInformationTabComponent,
    RegisterAppointmentTabComponent,
    EntryOrderComponent,
    EntryOrderViewComponent,
  ],
})
export class EconomicCompensationModule {}
