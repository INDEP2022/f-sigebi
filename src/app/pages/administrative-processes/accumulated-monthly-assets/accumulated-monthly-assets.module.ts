import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccumulatedMonthlyAssetsRoutingModule } from './accumulated-monthly-assets-routing.module';
import { AccumulatedMonthlyAssetsComponent } from './accumulated-monthly-assets/accumulated-monthly-assets.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    AccumulatedMonthlyAssetsComponent
  ],
  imports: [
    CommonModule,
    AccumulatedMonthlyAssetsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule,

  ]
})
export class AccumulatedMonthlyAssetsModule { }
