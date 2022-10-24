import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmGeCdcClcCCalculateCommissionComponent } from './c-bm-ge-cdc-clc-c-calculate-commission/c-bm-ge-cdc-clc-c-calculate-commission.component';
import { CBmGeCdcClcMCalculateCommissionRoutingModule } from './c-bm-ge-cdc-clc-m-calculate-commission-routing.module';

@NgModule({
  declarations: [CBmGeCdcClcCCalculateCommissionComponent],
  imports: [
    CommonModule,
    CBmGeCdcClcMCalculateCommissionRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class CBmGeCdcClcMCalculateCommissionModule {}
