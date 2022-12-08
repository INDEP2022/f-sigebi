import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReclassRecoveryOrdersRoutingModule } from './reclass-recovery-orders-routing.module';
import { ReclassRecoveryOrdersComponent } from './reclass-recovery-orders/reclass-recovery-orders.component';

@NgModule({
  declarations: [ReclassRecoveryOrdersComponent],
  imports: [
    CommonModule,
    ReclassRecoveryOrdersRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class ReclassRecoveryOrdersModule {}
