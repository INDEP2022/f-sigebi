import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherCurrenciesRoutingModule } from './other-currencies-routing.module';
import { OtherCurrenciesComponent } from './other-currencies/other-currencies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [OtherCurrenciesComponent],
  imports: [
    CommonModule,
    OtherCurrenciesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class OtherCurrenciesModule {}
