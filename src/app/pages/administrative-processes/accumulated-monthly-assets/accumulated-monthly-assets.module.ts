import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccumulatedMonthlyAssetsRoutingModule } from './accumulated-monthly-assets-routing.module';
import { AccumulatedMonthlyAssetsComponent } from './accumulated-monthly-assets/accumulated-monthly-assets.component';

@NgModule({
  declarations: [AccumulatedMonthlyAssetsComponent],
  imports: [
    CommonModule,
    AccumulatedMonthlyAssetsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    DelegationSharedComponent,
  ],
})
export class AccumulatedMonthlyAssetsModule {}
