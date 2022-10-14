import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CBmGeCdcClcMCalculateCommissionRoutingModule } from './c-bm-ge-cdc-clc-m-calculate-commission-routing.module';
import { CBmGeCdcClcCCalculateCommissionComponent } from './c-bm-ge-cdc-clc-c-calculate-commission/c-bm-ge-cdc-clc-c-calculate-commission.component';

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
