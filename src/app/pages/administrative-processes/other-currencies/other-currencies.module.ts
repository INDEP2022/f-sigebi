import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../shared/shared.module';
import { OtherCurrenciesRoutingModule } from './other-currencies-routing.module';
import { OtherCurrenciesComponent } from './other-currencies/other-currencies.component';

@NgModule({
  declarations: [OtherCurrenciesComponent],
  imports: [
    CommonModule,
    OtherCurrenciesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DelegationSharedComponent,
    BsDatepickerModule.forRoot(),
  ],
})
export class OtherCurrenciesModule {}
